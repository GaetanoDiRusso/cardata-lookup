# Certificado SUCIVE Testing Endpoint

## Overview
This endpoint allows testing the "Emisión de certificado SUCIVE" workflow. It generates a vehicle data retrieval for the certificado SUCIVE type, which requires a request number (Nro de tramite) to proceed.

## Endpoint
```
POST /api/testing/scraping/certificado-sucive
```

## Request Body
```json
{
  "folderId": "string",
  "userId": "string",
  "requestNumber": "string"
}
```

### Parameters
- **folderId** (required): The ID of the folder containing the vehicle information
- **userId** (required): The ID of the user making the request
- **requestNumber** (required): The request number (Nro de tramite) required for SUCIVE certificate emission

## Response

### Success Response (201)
```json
{
  "id": "string",
  "folderId": "string",
  "dataRetrievalType": "certificado_sucive",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "data": null,
  "imageUrls": [],
  "pdfUrls": [],
  "videoUrls": []
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Missing required field: [fieldName]"
}
```

#### 403 Forbidden
```json
{
  "error": "Testing endpoints not available in production"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Error message description"
}
```

## Usage Examples

### cURL
```bash
curl -X POST http://localhost:3000/api/testing/scraping/certificado-sucive \
  -H "Content-Type: application/json" \
  -d '{
    "folderId": "your-folder-id",
    "userId": "your-user-id",
    "requestNumber": "TRAMITE123456"
  }'
```

### JavaScript/Fetch
```javascript
const response = await fetch('/api/testing/scraping/certificado-sucive', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    folderId: 'your-folder-id',
    userId: 'your-user-id',
    requestNumber: 'TRAMITE123456'
  })
});

const result = await response.json();
```

## Notes
- This endpoint is only available in testing/development environments
- The request number is a required field specific to SUCIVE certificate emission
- The endpoint will create a vehicle data retrieval record that will be processed by the scraping service
- The scraping service will use the request number to fill the SUCIVE form and generate the certificate
- Results will include PDF files containing the generated SUCIVE certificate

## Related Components
- **Use Case**: `CertificadoSuciveVehicleDataRetrievalUseCase`
- **Server Action**: `generateCertificadoSuciveDataRetrieval`
- **UI Component**: `DataRetrievalCard` (with request number input)
- **Status Renderer**: `renderCertificadoSuciveStatus` 