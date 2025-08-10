# Solicitar Certificado SUCIVE - API Testing Endpoint

## Overview
This endpoint allows testing the "Solicitar Certificado SUCIVE" (Request SUCIVE Certificate) functionality without going through the full UI workflow.

## Endpoint
```
POST /api/testing/scraping/solicitar-certificado
```

## Request Body
```json
{
  "folderId": "string",
  "userId": "string",
  "requesterData": {
    "fullName": "string",
    "identificationType": "CI" | "RUT",
    "identificationNumber": "string",
    "email": "string",
    "phoneNumber": "string",
    "address": "string"
  }
}
```

### Required Fields
- **folderId**: The ID of the folder containing the vehicle data
- **userId**: The ID of the user making the request
- **requesterData**: Object containing the requester's personal information
  - **fullName**: Full name of the person requesting the certificate
  - **identificationType**: Type of identification document ("CI" or "RUT")
  - **identificationNumber**: Identification number
  - **email**: Email address
  - **phoneNumber**: Phone number
  - **address**: Complete address

## Response

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "folderId": "string",
    "dataRetrievalType": "solicitar_certificado",
    "status": "completed",
    "data": {},
    "imageUrls": [],
    "pdfUrls": [],
    "videoUrls": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Error message description"
}
```

## What This Endpoint Does
1. **Validates Input**: Checks that folderId and userId are provided
2. **Finds Folder**: Retrieves the folder and extracts vehicle data (matricula, padron, departamento)
3. **Calls Scraping Service**: Makes a request to the external SUCIVE website to request a certificate
4. **Processes Response**: Handles the scraping response and any generated files
5. **Saves Results**: Stores the results in the database with appropriate status

## Use Cases
- **Testing**: Verify the scraping functionality works correctly
- **Development**: Debug issues with the certificate request process
- **Integration**: Test the complete workflow from API call to database storage

## Notes
- This endpoint requires a valid folder with vehicle data
- The user must have permission to access the specified folder
- The scraping process may take some time depending on the SUCIVE website response
- Any errors during the process will be captured and returned in the response 