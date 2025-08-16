import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { matriculaVehicleDataRetrievalUseCase } from '@/server/di';
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
    const { folderId } = await request.json();
    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    const userContext: ICurrentUserContext = {
      userId: (session?.user as any).id,
    };

    // Create logger
    const logger = new Logger(userContext.userId, 'matricula-api-route');
    logger.info('Starting matricula data retrieval via API route', { folderId });

    // Execute the use case
    const result = await matriculaVehicleDataRetrievalUseCase.generateMatriculaVehicleDataRetrieval({
      folderId,
    }, userContext, logger);

    logger.info('Matricula data retrieval completed successfully');

    // Return the result
    return NextResponse.json(result.toPresentation(), { status: 200 });

  } catch (error: any) {
    console.error('Error in matricula API route:', error);
    
    return NextResponse.json(
      error.message || 'Internal server error',
      { status: 500 }
    );
  }
}
