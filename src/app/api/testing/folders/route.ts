import { NextRequest, NextResponse } from 'next/server';
import { folderUseCase } from '@/server/di';
import { isTestingEnabled } from '@/constants/testingRoutes';

// Production restriction - only available in development
const isProduction = !isTestingEnabled();

export async function GET(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const folderId = searchParams.get('folderId');
    const registrationNumber = searchParams.get('registrationNumber');
    const identificationNumber = searchParams.get('identificationNumber');

    if (folderId) {
      // Get specific folder
      const folder = await folderUseCase.findFolderById({
        folderId,
      }, {
        userId: userId!,
      });
      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
      }
      return NextResponse.json(folder.toPresentation());
    }

    if (userId) {
      // Get user's folders
      const folders = await folderUseCase.findFoldersPrevByUserId({
        userId,
      }, {
        userId: userId!,
      });
      return NextResponse.json(folders.map(f => f.toPresentation()));
    }

    if (registrationNumber) {
      // Get folders by vehicle registration
      const folders = await folderUseCase.findFoldersByVehicleRegistration({
        registrationNumber,
      }, {
        userId: userId!,
      });
      return NextResponse.json(folders.map(f => f.toPresentation()));
    }

    if (identificationNumber) {
      // Get folders by person identification
      const folders = await folderUseCase.findFoldersByPersonIdentification({
        identificationNumber,
      }, {
        userId: userId!,
      });
      return NextResponse.json(folders.map(f => f.toPresentation()));
    }

    return NextResponse.json({ error: 'Missing required parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/testing/folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const { ownerId, vehicle, seller, buyer } = body;
    
    if (!ownerId || !vehicle || !seller || !buyer) {
      return NextResponse.json({ 
        error: 'Missing required fields: ownerId, vehicle, seller, buyer' 
      }, { status: 400 });
    }

    // Validate vehicle fields
    const { registrationNumber, plateNumber, brand, model, year, department } = vehicle;
    if (!registrationNumber || !plateNumber || !brand || !model || !year || !department) {
      return NextResponse.json({ 
        error: 'Missing vehicle fields: registrationNumber, plateNumber, brand, model, year, department' 
      }, { status: 400 });
    }

    // Validate seller fields
    const { identificationNumber: sellerId, name: sellerName, dateOfBirth: sellerDob } = seller;
    if (!sellerId || !sellerName || !sellerDob) {
      return NextResponse.json({ 
        error: 'Missing seller fields: identificationNumber, name, dateOfBirth' 
      }, { status: 400 });
    }

    // Validate buyer fields
    const { identificationNumber: buyerId, name: buyerName, dateOfBirth: buyerDob } = buyer;
    if (!buyerId || !buyerName || !buyerDob) {
      return NextResponse.json({ 
        error: 'Missing buyer fields: identificationNumber, name, dateOfBirth' 
      }, { status: 400 });
    }

    const folder = await folderUseCase.createFolder({
      folder: {
        vehicle: {
          registrationNumber,
          plateNumber,
          brand,
          model,
          year,
          department,
        },
        seller: {
          identificationNumber: sellerId,
          name: sellerName,
          dateOfBirth: sellerDob,
        },
        buyer: {
          identificationNumber: buyerId,
          name: buyerName,
          dateOfBirth: buyerDob,
        },
      }
    }, {
      userId: ownerId,
    });

    return NextResponse.json(folder.toPresentation(), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/testing/folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    const body = await request.json();
    
    // Validate required fields
    const { ownerId } = body;

    if (!folderId) {
      return NextResponse.json({ error: 'Missing folderId parameter' }, { status: 400 });
    }

    await folderUseCase.deleteFolder({
      folderId,
    }, {
      userId: ownerId,
    });
    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/testing/folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 