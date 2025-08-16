import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { paymentAgreementVehicleDataRetrievalUseCase } from '@/server/di';
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
    const logger = new Logger(userContext.userId, 'payment-agreement-api-route');
    logger.info('Starting payment agreement data retrieval via API route', { folderId });

    // Execute the use case
    const result = await paymentAgreementVehicleDataRetrievalUseCase.generatePaymentAgreementVehicleDataRetrieval({
      folderId,
    }, userContext, logger);

    logger.info('Payment agreement data retrieval completed successfully');

    // Return the result
    return NextResponse.json(result.toPresentation(), { status: 200 });

  } catch (error: any) {
    console.error('Error in payment agreement API route:', error);
    
    return NextResponse.json(
      error.message || 'Internal server error',
      { status: 500 }
    );
  }
}
