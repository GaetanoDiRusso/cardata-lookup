import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { certificadoSuciveVehicleDataRetrievalUseCase } from '@/server/di';
import { ICurrentUserContext } from '@/server/domain/interfaces/ICurrentUserContext';
import { Logger } from '@/server/domain/utils/Logger';

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { folderId, requestNumber } = await request.json();
    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    if (!requestNumber) {
      return NextResponse.json(
        { error: 'Request number is required' },
        { status: 400 }
      );
    }

    const userContext: ICurrentUserContext = {
      userId: (session?.user as any).id,
    };

    // Create logger
    const logger = new Logger(userContext.userId, 'certificado-sucive-api-route');
    logger.info('Starting certificado SUCIVE data retrieval via API route', { folderId, requestNumber });

    // Execute the use case
    const result = await certificadoSuciveVehicleDataRetrievalUseCase.generateCertificadoSuciveVehicleDataRetrieval({
      folderId,
      requestNumber,
    }, userContext, logger);

    logger.info('Certificado SUCIVE data retrieval completed successfully');

    // Return the result
    return NextResponse.json(result.toPresentation(), { status: 200 });

  } catch (error: any) {
    console.error('Error in certificado SUCIVE API route:', error);
    
    return NextResponse.json(
      error.message || 'Internal server error',
      { status: 500 }
    );
  }
}
