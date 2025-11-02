'use client';

import React, { useState } from 'react';
import { useMCPTools } from '@/lib/mcp/hooks';
import { Button } from '@/components/ui/Button';
import { H2, H3, Paragraph, Small, Muted } from '@/components/ui/Typography';
import { MCPCallToolParams } from '@/lib/mcp/client';

interface MCPToolsExplorerProps {
  serverUrl: string;
  apiKey?: string;
}

export const MCPToolsExplorer: React.FC<MCPToolsExplorerProps> = ({ serverUrl, apiKey }) => {
  const { tools, isLoading, error, callTool } = useMCPTools(serverUrl, apiKey);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [toolResult, setToolResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCallTool = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    setToolResult(null);

    try {
      const params: MCPCallToolParams = {
        name: selectedTool,
        arguments: toolArgs,
      };

      const result = await callTool(params);
      
      if (result.isError) {
        setToolResult(`Error: ${result.content[0]?.text || 'Unknown error'}`);
      } else {
        const resultText = result.content
          .map(c => c.text || JSON.stringify(c.data, null, 2))
          .join('\n');
        setToolResult(resultText);
      }
    } catch (err) {
      setToolResult(`Error: ${err instanceof Error ? err.message : 'Failed to execute tool'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const selectedToolDetails = tools.find(t => t.name === selectedTool);

  return (
    <div className="space-y-6">
      <div>
        <H2 className="mb-2">MCP Tools Explorer</H2>
        <Paragraph className="text-gray-600">
          Explore and test tools available on the MCP server
        </Paragraph>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Paragraph className="text-red-700">{error}</Paragraph>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tools List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <H3 className="mb-4">Available Tools ({tools.length})</H3>
            
            {tools.length === 0 ? (
              <Paragraph className="text-gray-500">No tools available</Paragraph>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => {
                      setSelectedTool(tool.name);
                      setToolArgs({});
                      setToolResult(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTool === tool.name
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">{tool.name}</div>
                    {tool.description && (
                      <Small className="text-gray-600 mt-1 block">{tool.description}</Small>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tool Details & Execution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedToolDetails ? (
              <div className="space-y-4">
                <div>
                  <H3 className="mb-2">{selectedToolDetails.name}</H3>
                  {selectedToolDetails.description && (
                    <Paragraph className="text-gray-600">{selectedToolDetails.description}</Paragraph>
                  )}
                </div>

                {/* Input Schema */}
                {selectedToolDetails.inputSchema?.properties && (
                  <div>
                    <Small className="font-semibold block mb-2">Parameters:</Small>
                    <div className="space-y-3">
                      {Object.entries(selectedToolDetails.inputSchema.properties).map(([key, schema]: [string, unknown]) => {
                        const schemaObj = schema as { type?: string; description?: string };
                        const isRequired = selectedToolDetails.inputSchema?.required?.includes(key);
                        
                        return (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {key}
                              {isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {schemaObj.description && (
                              <Muted className="block mb-1">{schemaObj.description}</Muted>
                            )}
                            <input
                              type="text"
                              value={toolArgs[key] || ''}
                              onChange={(e) => setToolArgs({ ...toolArgs, [key]: e.target.value })}
                              placeholder={`Enter ${key}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCallTool}
                  disabled={isExecuting}
                  variant="primary"
                  className="w-full"
                >
                  {isExecuting ? 'Executing...' : 'Execute Tool'}
                </Button>

                {/* Results */}
                {toolResult && (
                  <div>
                    <Small className="font-semibold block mb-2">Result:</Small>
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
                      {toolResult}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <Paragraph>Select a tool to view details</Paragraph>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
