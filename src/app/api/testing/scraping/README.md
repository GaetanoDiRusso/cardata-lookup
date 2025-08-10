# Scraping Testing Endpoints

This directory contains testing endpoints for different types of vehicle data retrieval operations. These endpoints are only available when testing is enabled.

## Available Endpoints

### 1. Infractions Data Retrieval
- **Endpoint**: `POST /api/testing/scraping/infracciones`
- **Purpose**: Test infractions data retrieval functionality
- **Request Body**:
  ```json
  {
    "folderId": "string",
    "userId": "string"
  }
  ```
- **Response**: Returns the complete `VehicleDataRetrieval` object

### 2. Debt Data Retrieval
- **Endpoint**: `POST /api/testing/scraping/deuda`
- **Purpose**: Test debt data retrieval functionality
- **Request Body**:
  ```json
  {
    "folderId": "string",
    "userId": "string"
  }
  ```
- **Response**: Returns the complete `VehicleDataRetrieval` object

### 3. Matricula Consultation
- **Endpoint**: `POST /api/testing/scraping/consultar-matricula`
- **Purpose**: Test vehicle registration consultation functionality
- **Request Body**:
  ```json
  {
    "folderId": "string",
    "userId": "string"
  }
  ```
- **Response**: Returns the complete `VehicleDataRetrieval` object

## Usage Examples

### Testing with cURL

```bash
# Test infractions retrieval
curl -X POST http://localhost:3000/api/testing/scraping/infracciones \
  -H "Content-Type: application/json" \
  -d '{"folderId": "your-folder-id", "userId": "your-user-id"}'

# Test debt retrieval
curl -X POST http://localhost:3000/api/testing/scraping/deuda \
  -H "Content-Type: application/json" \
  -d '{"folderId": "your-folder-id", "userId": "your-user-id"}'

# Test matricula consultation
curl -X POST http://localhost:3000/api/testing/scraping/consultar-matricula \
  -H "Content-Type: application/json" \
  -d '{"folderId": "your-folder-id", "userId": "your-user-id"}'
```

### Testing with Postman

Import the provided Postman collection which includes all these endpoints with proper request bodies and examples.

## Notes

- All endpoints require both `folderId` and `userId` in the request body
- The `folderId` must correspond to an existing folder that the user has access to
- These endpoints directly call their respective use cases for testing purposes
- All endpoints return the complete result object from the use case execution
- Testing endpoints are automatically disabled in production environments 