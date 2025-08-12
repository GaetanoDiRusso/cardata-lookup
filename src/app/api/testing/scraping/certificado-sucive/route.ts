import { NextRequest, NextResponse } from 'next/server';
import { certificadoSuciveVehicleDataRetrievalUseCase } from '@/server/di';
import { isTestingEnabled } from '@/constants/testingRoutes';
import { Logger } from '@/server/domain/utils/Logger';

const isProduction = !isTestingEnabled();

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { folderId, userId, requestNumber } = body;
    
    if (!folderId) {
      return NextResponse.json({ error: 'Missing required field: folderId' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'Missing required field: userId' }, { status: 400 });
    }
    if (!requestNumber) {
      return NextResponse.json({ error: 'Missing required field: requestNumber' }, { status: 400 });
    }

    const result = await certificadoSuciveVehicleDataRetrievalUseCase.generateCertificadoSuciveVehicleDataRetrieval(
      { folderId, requestNumber },
      { userId },
      new Logger(userId, 'CertificadoSuciveVehicleDataRetrievalUseCase :: testing endpoint', 'BACKEND_PROCESSING')
    );

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/testing/scraping/certificado-sucive:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 