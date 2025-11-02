'use client';

import React, { useState } from 'react';
import { useMCPResources } from '@/lib/mcp/hooks';
import { Button } from '@/components/ui/Button';
import { H2, H3, Paragraph, Small } from '@/components/ui/Typography';

interface MCPResourcesViewerProps {
  serverUrl: string;
  apiKey?: string;
}

export const MCPResourcesViewer: React.FC<MCPResourcesViewerProps> = ({ serverUrl, apiKey }) => {
  const { resources, isLoading, error, readResource } = useMCPResources(serverUrl, apiKey);
  const [selectedResourceUri, setSelectedResourceUri] = useState<string | null>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  const handleReadResource = async (uri: string) => {
    setIsReading(true);
    setResourceContent(null);

    try {
      const result = await readResource(uri);
      setResourceContent(JSON.stringify(result, null, 2));
    } catch (err) {
      setResourceContent(`Error: ${err instanceof Error ? err.message : 'Failed to read resource'}`);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <H2 className="mb-2">MCP Resources</H2>
        <Paragraph className="text-gray-600">
          Browse and read resources from the MCP server
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
          {/* Resources List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <H3 className="mb-4">Available Resources ({resources.length})</H3>
            
            {resources.length === 0 ? (
              <Paragraph className="text-gray-500">No resources available</Paragraph>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {resources.map((resource) => (
                  <button
                    key={resource.uri}
                    onClick={() => {
                      setSelectedResourceUri(resource.uri);
                      handleReadResource(resource.uri);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedResourceUri === resource.uri
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">{resource.name}</div>
                    {resource.description && (
                      <Small className="text-gray-600 mt-1 block">{resource.description}</Small>
                    )}
                    <Small className="text-gray-400 mt-1 block font-mono text-xs">{resource.uri}</Small>
                    {resource.mimeType && (
                      <Small className="text-blue-600 mt-1 block">{resource.mimeType}</Small>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resource Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedResourceUri ? (
              <div className="space-y-4">
                <div>
                  <H3 className="mb-2">Resource Content</H3>
                  <Small className="text-gray-600 font-mono">{selectedResourceUri}</Small>
                </div>

                {isReading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : resourceContent ? (
                  <div>
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-96 text-sm">
                      {resourceContent}
                    </pre>
                    <Button
                      onClick={() => handleReadResource(selectedResourceUri)}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Refresh
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <Paragraph>Select a resource to view its content</Paragraph>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
