import { NextRequest, NextResponse } from 'next/server';
import { vehicleDataRetrievalUseCase, infractionsVehicleDataRetrievalUseCase } from '@/server/di';
import { isTestingEnabled } from '@/constants/testingRoutes';

// Production restriction - only available in development
const isProduction = !isTestingEnabled();

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { folderId } = body;
    
    if (!folderId) {
      return NextResponse.json({ 
        error: 'Missing required field: folderId' 
      }, { status: 400 });
    }

    // Generate the vehicle data retrieval (this handles the entire process synchronously)
    const result = await infractionsVehicleDataRetrievalUseCase.generateInfractionsVehicleDataRetrieval({
      folderId,
    });

    return NextResponse.json({
      id: result.id,
      status: result.status,
      data: result.data,
      imageUrls: result.imageUrls,
      pdfUrls: result.pdfUrls,
      videoUrls: result.videoUrls,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/testing/scraping/infracciones:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json({ error: 'Missing folderId parameter' }, { status: 400 });
    }

    const status = await infractionsVehicleDataRetrievalUseCase.getInfractionsVehicleDataRetrievalStatus(folderId);
    
    if (!status) {
      return NextResponse.json({ error: 'No infractions vehicle data retrieval found for this folder' }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error in GET /api/testing/scraping/infracciones:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}