# Testing Documentation - Cardata Lookup API

## 📋 Overview

This document describes the testing setup for the Cardata Lookup API, including endpoints, Postman collection, and testing procedures for both folder management and vehicle data retrieval functionality.

## 🏗️ Architecture Overview

### Database Structure
```
Folders Collection:
├── ownerId (User reference)
├── vehicleId (Vehicle reference) - REQUIRED
├── sellerId (Person reference) - REQUIRED
├── buyerId (Person reference) - REQUIRED
├── createdAt
└── updatedAt

Vehicles Collection:
├── folderId (Folder reference) - OPTIONAL
├── registrationNumber (NOT unique)
├── plateNumber (can be different per folder)
├── brand, model, year
├── createdAt
└── updatedAt

People Collection:
├── folderId (Folder reference) - OPTIONAL
├── identificationNumber (NOT unique)
├── name, dateOfBirth
├── role ('seller' or 'buyer')
├── createdAt
└── updatedAt

Vehicle Data Retrieval Collection:
├── folderId (Folder reference) - REQUIRED
├── dataRetrievalType (infracciones, deuda, etc.) - REQUIRED
├── status (pending, in_progress, completed, failed) - REQUIRED
├── data (Mixed) - The retrieval result data
├── imageUrls (Array of strings) - URLs to image files
├── pdfUrls (Array of strings) - URLs to PDF files
├── videoUrls (Array of strings) - URLs to video files
├── startedAt, completedAt (Date)
├── createdAt, updatedAt (Date)
└── indexes: {folderId: 1, dataRetrievalType: 1}, {status: 1, createdAt: -1}
```

### Key Business Rules
- ✅ **Same vehicle** can appear in multiple folders with different plates
- ✅ **Same person** can appear in multiple folders with different roles
- ✅ **Data independence** between folders
- ✅ **Atomic transactions** for all operations
- ✅ **Vehicle data retrieval** is synchronous (30-40 seconds)
- ✅ **Multiple retrieval types** supported (infracciones, deuda, etc.)
- ✅ **Vehicle data consistency** - retrieved from folder's vehicle information

## 🚀 API Endpoints

### Base URL
```
http://localhost:3000/api/testing
```

### Endpoints Summary

#### Folder Management
| Method | Endpoint | Description | Environment |
|--------|----------|-------------|-------------|
| `POST` | `/api/testing/folders` | Create a new folder | Development Only |
| `GET` | `/api/testing/folders?userId={id}` | Get user's folders | Development Only |
| `GET` | `/api/testing/folders?folderId={id}` | Get specific folder | Development Only |
| `GET` | `/api/testing/folders?registrationNumber={num}` | Get folders by vehicle | Development Only |
| `GET` | `/api/testing/folders?identificationNumber={num}` | Get folders by person | Development Only |
| `DELETE` | `/api/testing/folders?folderId={id}` | Delete a folder | Development Only |

#### Vehicle Data Retrieval
| Method | Endpoint | Description | Environment |
|--------|----------|-------------|-------------|
| `POST` | `/api/testing/scraping/infracciones` | Generate infractions data retrieval | Development Only |
| `GET` | `/api/testing/scraping/infracciones?folderId={id}` | Get infractions retrieval status | Development Only |

## 📦 Postman Collection

### Import Instructions
1. Open Postman
2. Click "Import" 
3. Select the `postman-collection.json` file from the `testing/` folder
4. The collection will be imported with all endpoints and test data

### Environment Variables
The collection uses these variables:
- `{{baseUrl}}`: `http://localhost:3000/api/testing`
- `{{folderId}}`: Will be set after creating a folder
- `{{userId}}`: `507f1f77bcf86cd799439011` (mock user ID)

### Test Scenarios

#### Folder Management

##### 1. Create Folder
- **Method**: POST
- **Endpoint**: `/api/testing/folders`
- **Body**: Complete folder data with vehicle, seller, and buyer
- **Expected**: 201 Created with folder details

##### 2. Get User Folders
- **Method**: GET
- **Endpoint**: `/api/testing/folders?userId={{userId}}`
- **Expected**: Array of folder previews

##### 3. Get Folder by ID
- **Method**: GET
- **Endpoint**: `/api/testing/folders?folderId={{folderId}}`
- **Expected**: Complete folder details

##### 4. Get Folders by Vehicle
- **Method**: GET
- **Endpoint**: `/api/testing/folders?registrationNumber=ABC123456`
- **Expected**: All folders for that vehicle

##### 5. Get Folders by Person
- **Method**: GET
- **Endpoint**: `/api/testing/folders?identificationNumber=12345678`
- **Expected**: All folders for that person

##### 6. Create Multiple Folders (Same Vehicle)
- **Method**: POST
- **Endpoint**: `/api/testing/folders`
- **Body**: Same vehicle, different plate
- **Expected**: Second folder created successfully

##### 7. Delete Folder
- **Method**: DELETE
- **Endpoint**: `/api/testing/folders?folderId={{folderId}}`
- **Expected**: 200 OK with success message

#### Vehicle Data Retrieval

##### 1. Generate Infractions Data Retrieval
- **Method**: POST
- **Endpoint**: `/api/testing/scraping/infracciones`
- **Body**: Folder ID only (vehicle data obtained from folder)
- **Expected**: 201 Created with retrieval result (synchronous)

##### 2. Get Infractions Data Retrieval Status
- **Method**: GET
- **Endpoint**: `/api/testing/scraping/infracciones?folderId={{folderId}}`
- **Expected**: Retrieval status and metadata

## 🧪 Testing Procedures

### Manual Testing with curl

#### Folder Management
```bash
# 1. Create a folder
curl -X POST http://localhost:3000/api/testing/folders \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "507f1f77bcf86cd799439011",
    "vehicle": {
      "registrationNumber": "ABC123456",
      "plateNumber": "XYZ789",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2020
    },
    "seller": {
      "identificationNumber": "12345678",
      "name": "Juan Pérez",
      "dateOfBirth": "1985-03-15"
    },
    "buyer": {
      "identificationNumber": "87654321",
      "name": "María García",
      "dateOfBirth": "1990-07-22"
    }
  }'

# 2. Get user folders
curl "http://localhost:3000/api/testing/folders?userId=507f1f77bcf86cd799439011"

# 3. Get folders by vehicle
curl "http://localhost:3000/api/testing/folders?registrationNumber=ABC123456"

# 4. Get folders by person
curl "http://localhost:3000/api/testing/folders?identificationNumber=12345678"
```

#### Vehicle Data Retrieval
```bash
# 1. Generate infractions data retrieval
curl -X POST http://localhost:3000/api/testing/scraping/infracciones \
  -H "Content-Type: application/json" \
  -d '{
    "folderId": "folder_id_here"
  }'

# 2. Get infractions retrieval status
curl "http://localhost:3000/api/testing/scraping/infracciones?folderId=folder_id_here"
```

### Test Data Examples

#### Sample Vehicle Data
```json
{
  "registrationNumber": "ABC123456",
  "plateNumber": "XYZ789",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020
}
```

#### Sample Person Data
```json
{
  "identificationNumber": "12345678",
  "name": "Juan Pérez",
  "dateOfBirth": "1985-03-15"
}
```

#### Sample Folder Creation
```json
{
  "ownerId": "507f1f77bcf86cd799439011",
  "vehicle": {
    "registrationNumber": "ABC123456",
    "plateNumber": "XYZ789",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020
  },
  "seller": {
    "identificationNumber": "12345678",
    "name": "Juan Pérez",
    "dateOfBirth": "1985-03-15"
  },
  "buyer": {
    "identificationNumber": "87654321",
    "name": "María García",
    "dateOfBirth": "1990-07-22"
  }
}
```

#### Sample Vehicle Data Retrieval Request
```json
{
  "folderId": "507f1f77bcf86cd799439011"
}
```

#### Sample Vehicle Data Retrieval Response
```json
{
  "id": "507f1f77bcf86cd799439012",
  "status": "completed",
  "data": {
    "hasInfractions": true
  },
  "imageUrls": ["https://example.com/screenshots/infractions-screenshot.png"],
  "pdfUrls": ["https://example.com/pdfs/infractions-report.pdf"],
  "videoUrls": ["https://example.com/videos/infractions-recording.mp4"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Environment Restrictions

### Development Only
All testing endpoints are **disabled in production** for security reasons. The system uses centralized constants and environment checks:

#### Constants Configuration
```typescript
// src/constants/testingRoutes.ts
export const TESTING_BASE_PATH = '/api/testing';
export const TESTING_API_PATH = `${TESTING_BASE_PATH}`;

export const isTestingEnabled = () => {
  return process.env.NODE_ENV !== 'production';
};
```

#### Middleware Protection
```typescript
// src/middleware.ts
import { TESTING_BASE_PATH, isTestingEnabled } from './constants/testingRoutes';

// Skip middleware for testing routes ONLY in development
if (isTestingEnabled() && path.startsWith(TESTING_BASE_PATH)) {
  return NextResponse.next();
}
```

#### Endpoint Protection
```typescript
// src/app/api/testing/folders/route.ts
import { isTestingEnabled } from '@/constants/testingRoutes';

const isProduction = !isTestingEnabled();

export async function GET(request: NextRequest) {
  if (isProduction) {
    return NextResponse.json({ error: 'Testing endpoints not available in production' }, { status: 403 });
  }
  // ... rest of the code
}
```

### Production Considerations
- Testing endpoints are automatically disabled in production builds
- Middleware blocks all `/api/testing/*` routes in production
- Use proper authentication and authorization for production APIs
- Implement rate limiting and validation for production use

## 📁 File Structure

```
testing/
├── README.md                    # This documentation
└── postman-collection.json      # Postman collection

src/
├── app/
│   └── api/
│       └── testing/
│           ├── folders/
│           │   └── route.ts     # Folder testing endpoints
│           └── scraping/
│               └── infracciones/
│                   └── route.ts # Vehicle data retrieval endpoints
├── constants/
│   └── testingRoutes.ts         # Testing route constants
└── middleware.ts                # Middleware with testing exclusions
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` environment variable

2. **Validation Errors**
   - Verify all required fields are provided
   - Check data types (year should be number, etc.)

3. **Transaction Errors**
   - Check MongoDB version supports transactions
   - Ensure replica set is configured for transactions

4. **403 Forbidden Error**
   - Ensure you're running in development mode
   - Check `NODE_ENV` environment variable
   - Verify the endpoint URL is correct

5. **Middleware Redirect Issues**
   - Testing routes should bypass middleware in development
   - Check if `NODE_ENV` is set correctly
   - Verify constants are imported correctly

6. **404 Not Found Error**
   - Ensure the endpoint is in the correct Next.js API route structure
   - Check that the file is in the correct path
   - Verify the URL matches the file structure

7. **Vehicle Data Retrieval Timeout**
   - The process is synchronous and takes 30-40 seconds
   - This is normal behavior for data retrieval operations
   - Consider implementing progress indicators in production

8. **Folder Not Found Error**
   - Ensure the folderId exists in the database
   - Verify the folder contains vehicle information
   - Check that the folder is accessible to the user

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required fields | Required data not provided |
| 404 | Folder not found | Folder ID doesn't exist |
| 404 | No infractions vehicle data retrieval found | No retrieval data for folder |
| 500 | Internal server error | Database or server error |
| 403 | Not available in production | Endpoint disabled in prod |

## 📈 Future Enhancements

### Planned Testing Features
- [ ] Automated test suite with Jest
- [ ] Integration tests with test database
- [ ] Performance testing with load tests
- [ ] Contract testing for API compatibility
- [ ] Additional vehicle data retrieval types (deuda, certificado_sucive, etc.)

### Monitoring
- [ ] API response time monitoring
- [ ] Error rate tracking
- [ ] Database query performance
- [ ] User activity analytics
- [ ] Vehicle data retrieval success rates

---

**Last Updated**: December 2024
**Version**: 2.0.0 