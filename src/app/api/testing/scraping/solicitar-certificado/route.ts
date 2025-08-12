import { NextRequest, NextResponse } from 'next/server';
import { solicitarCertificadoVehicleDataRetrievalUseCase } from '@/server/di';
import { ICurrentUserContext } from '@/server/domain/interfaces/ICurrentUserContext';
import { Logger } from '@/server/domain/utils/Logger';
import { isTestingEnabled } from '@/constants/testingRoutes';

const isProduction = !isTestingEnabled();

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { folderId, userId, requesterData } = body;

    if (!folderId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: folderId, userId' },
        { status: 400 }
      );
    }

    // Validate requester data
    if (!requesterData || !requesterData.fullName || !requesterData.identificationNumber || !requesterData.email) {
      return NextResponse.json(
        { error: 'Missing required requester data: fullName, identificationNumber, email' },
        { status: 400 } 
      );
    }

    const userContext: ICurrentUserContext = { userId };

    const result = await solicitarCertificadoVehicleDataRetrievalUseCase.generateSolicitarCertificadoVehicleDataRetrieval(
      { folderId, requesterData },
      userContext,
      new Logger(userId, 'SolicitarCertificadoVehicleDataRetrievalUseCase :: testing endpoint', 'BACKEND_PROCESSING')
    );

    return NextResponse.json({
      success: true,
      data: result.toPresentation(),
    });

  } catch (error: any) {
    console.error('Error in solicitar certificado API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 