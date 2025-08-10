# Payment Agreement Data Retrieval Testing Endpoint

## Overview
This endpoint allows testing of the payment agreement consultation functionality without going through the full authentication flow.

## Endpoint
`POST /api/testing/scraping/consultar-convenio`

## Request Body
```json
{
  "folderId": "string",
  "userId": "string"
}
```

## Parameters
- `folderId` (required): The ID of the folder to consult payment agreements for
- `userId` (required): The ID of the user making the request

## Response
- **Success (201)**: Returns the created VehicleDataRetrieval object
- **Error (400)**: Missing required fields
- **Error (403)**: Testing endpoints not available in production
- **Error (500)**: Internal server error

## Usage
This endpoint is only available when testing is enabled. It bypasses authentication and directly calls the payment agreement use case.

## Example Request
```bash
curl -X POST http://localhost:3000/api/testing/scraping/consultar-convenio \
  -H "Content-Type: application/json" \
  -d '{
    "folderId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012"
  }'
```

## Notes
- The endpoint requires a valid folder ID that exists in the system
- The folder must have vehicle data (plate number, registration number, etc.)
- The payment agreement consultation requires both plate number and registration number
- Results are stored in the database and can be retrieved later 