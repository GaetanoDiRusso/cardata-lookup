import { NextRequest, NextResponse } from 'next/server';
import { debtVehicleDataRetrievalUseCase } from '@/server/di';
import { isTestingEnabled } from '@/constants/testingRoutes';
import { Logger } from '@/server/domain/utils/Logger';

// Production restriction - only available in development
const isProduction = !isTestingEnabled();

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { folderId, userId } = body;
    
    if (!folderId) {
      return NextResponse.json({ 
        error: 'Missing required field: folderId' 
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'Missing required field: userId' 
      }, { status: 400 });
    }

    // Generate the debt vehicle data retrieval
    const result = await debtVehicleDataRetrievalUseCase.generateDebtVehicleDataRetrieval(
      { folderId },
      { userId },
      new Logger(userId, 'DebtVehicleDataRetrievalUseCase :: testing endpoint', 'BACKEND_PROCESSING')
    );

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/testing/scraping/deuda:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 