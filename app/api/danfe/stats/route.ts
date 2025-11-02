import { NextResponse } from 'next/server';
import { DanfeService } from '@/lib/db';

export async function GET() {
  try {
    const stats = await DanfeService.estatisticas();
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Não foi possível obter estatísticas' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao obter estatísticas' 
      },
      { status: 500 }
    );
  }
}
