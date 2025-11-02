import { NextResponse } from 'next/server';
import { DanfeService } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limite = parseInt(searchParams.get('limite') || '50');
    
    if (limite < 1 || limite > 500) {
      return NextResponse.json(
        { 
          success: false,
          error: 'O limite deve estar entre 1 e 500' 
        },
        { status: 400 }
      );
    }
    
    const historico = await DanfeService.listarHistorico(limite);
    
    return NextResponse.json({
      success: true,
      total: historico.length,
      danfes: historico,
    });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao obter histórico' 
      },
      { status: 500 }
    );
  }
}
