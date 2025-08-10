import { NextRequest, NextResponse } from 'next/server';
import { matriculaVehicleDataRetrievalUseCase } from '@/server/di';
import { isTestingEnabled } from '@/constants/testingRoutes';

const isProduction = !isTestingEnabled();

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { folderId, userId } = body;
    
    if (!folderId) {
      return NextResponse.json({ error: 'Missing required field: folderId' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'Missing required field: userId' }, { status: 400 });
    }

    const result = await matriculaVehicleDataRetrievalUseCase.generateMatriculaVehicleDataRetrieval(
      { folderId },
      { userId }
    );

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/testing/scraping/consultar-matricula:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 