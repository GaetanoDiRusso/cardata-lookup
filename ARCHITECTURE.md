# Cardata Lookup - Architecture Documentation

## 📋 Overview

This document describes the complete architecture of the Cardata Lookup application, including domain design, database structure, API design, and implementation details.

## 🏗️ Domain Architecture

### Business Domain

The application manages **Folders** that represent vehicle transactions between **Sellers** and **Buyers**. Each folder contains:

- **Vehicle**: The car being transacted (identified by registration number)
- **Seller**: Person selling the vehicle
- **Buyer**: Person buying the vehicle
- **Owner**: User who manages the folder

### Key Business Rules

1. **Vehicle Uniqueness**: Same vehicle (registration number) can appear in multiple folders with different plates
2. **Person Flexibility**: Same person can appear in multiple folders with different roles
3. **Data Independence**: Each folder owns its own vehicle and person data
4. **Transaction Safety**: All operations are atomic using MongoDB transactions

## 🗄️ Database Design

### Collections Structure

```
Folders Collection:
├── _id (ObjectId)
├── ownerId (ObjectId) - REQUIRED
├── vehicleId (ObjectId) - REQUIRED
├── sellerId (ObjectId) - REQUIRED
├── buyerId (ObjectId) - REQUIRED
├── createdAt (Date)
└── updatedAt (Date)

Vehicles Collection:
├── _id (ObjectId)
├── folderId (ObjectId) - OPTIONAL
├── registrationNumber (String) - NOT unique
├── plateNumber (String)
├── brand (String)
├── model (String)
├── year (Number)
├── createdAt (Date)
└── updatedAt (Date)

People Collection:
├── _id (ObjectId)
├── folderId (ObjectId) - OPTIONAL
├── identificationNumber (String) - NOT unique
├── name (String)
├── dateOfBirth (String)
├── role (String) - 'seller' | 'buyer'
├── createdAt (Date)
└── updatedAt (Date)
```

### Indexes

```javascript
// Vehicles
VehicleSchema.index({ registrationNumber: 1, folderId: 1 }, { unique: true });
VehicleSchema.index({ registrationNumber: 1 });

// People
PersonSchema.index({ identificationNumber: 1, folderId: 1, role: 1 }, { unique: true });
PersonSchema.index({ identificationNumber: 1 });
```

## 🏛️ Clean Architecture Implementation

### Domain Layer

#### Entities
```typescript
// Vehicle Entity
export class Vehicle {
  constructor(
    readonly id: string,
    readonly vehicleData: VehicleData,
    readonly folderId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}

// Person Entity
export class Person {
  constructor(
    readonly id: string,
    readonly identificationNumber: string,
    readonly name: string,
    readonly dateOfBirth: string,
  ) {}
}

// Folder Entity
export class Folder {
  constructor(
    readonly id: string,
    readonly ownerId: string,
    readonly vehicle: Vehicle,
    readonly seller: Person,
    readonly buyer: Person,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
```

#### Use Cases
```typescript
export class FolderUseCases {
  async createFolder(folder: CreateNewFolderDTO): Promise<Folder>
  async findFoldersPrevByUserId(userId: string): Promise<FolderPrev[]>
  async findFolderById(folderId: string): Promise<Folder | null>
  async findFoldersByVehicleRegistration(registrationNumber: string): Promise<FolderPrev[]>
  async findFoldersByPersonIdentification(identificationNumber: string): Promise<FolderPrev[]>
  async deleteFolder(folderId: string): Promise<void>
}
```

#### Repository Interface
```typescript
export interface IFolderRepository {
  findAllPrevByUserId(userId: string): Promise<FolderPrev[]>
  findByFolderId(folderId: string): Promise<Folder | null>
  findByVehicleRegistration(registrationNumber: string): Promise<FolderPrev[]>
  findByPersonIdentification(identificationNumber: string): Promise<FolderPrev[]>
  create(folder: ICreateFolderData): Promise<Folder>
  delete(folderId: string): Promise<void>
}
```

### Infrastructure Layer

#### Repository Implementation
```typescript
export class FolderRepositoryMongoDBImp implements IFolderRepository {
  // MongoDB implementation with transactions
  async create(folder: ICreateFolderData): Promise<Folder> {
    // 1. Create vehicle (without folderId)
    // 2. Create buyer (without folderId)
    // 3. Create seller (without folderId)
    // 4. Create folder with references
    // 5. Update entities with folderId
  }
}
```

#### Database Schemas
```typescript
// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: false },
  registrationNumber: { type: String, required: true },
  plateNumber: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
});

// Person Schema
const PersonSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: false },
  identificationNumber: { type: String, required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer'], required: true },
});
```

## 🔄 Transaction Flow

### Folder Creation Process

```typescript
// 1. Start MongoDB transaction
const session = await mongoose.startSession()
session.startTransaction()

// 2. Create entities without folderId
const vehicle = await VehicleSchema.create([{ ...vehicleData }], { session })
const buyer = await PersonSchema.create([{ ...buyerData, role: 'buyer' }], { session })
const seller = await PersonSchema.create([{ ...sellerData, role: 'seller' }], { session })

// 3. Create folder with references
const folder = await FolderSchema.create([{
  ownerId: folder.ownerId,
  vehicle: vehicle[0]._id,
  buyer: buyer[0]._id,
  seller: seller[0]._id,
}], { session })

// 4. Update entities with folderId
await VehicleSchema.updateOne({ _id: vehicle[0]._id }, { $set: { folderId: folder[0]._id } }, { session })
await PersonSchema.updateOne({ _id: buyer[0]._id }, { $set: { folderId: folder[0]._id } }, { session })
await PersonSchema.updateOne({ _id: seller[0]._id }, { $set: { folderId: folder[0]._id } }, { session })

// 5. Commit transaction
await session.commitTransaction()
```

## 🚀 API Design

### Testing Endpoints (Development Only)

```
Base URL: http://localhost:3000/testing/api/folders

POST   /testing/api/folders                    # Create folder
GET    /testing/api/folders?userId={id}        # Get user folders
GET    /testing/api/folders?folderId={id}      # Get specific folder
GET    /testing/api/folders?registrationNumber={num}  # Get folders by vehicle
GET    /testing/api/folders?identificationNumber={num} # Get folders by person
DELETE /testing/api/folders?folderId={id}      # Delete folder
```

### Request/Response Examples

#### Create Folder
```json
POST /testing/api/folders
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

#### Folder Response
```json
{
  "id": "507f1f77bcf86cd799439012",
  "ownerId": "507f1f77bcf86cd799439011",
  "vehicle": {
    "id": "507f1f77bcf86cd799439013",
    "registrationNumber": "ABC123456",
    "plateNumber": "XYZ789",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020
  },
  "seller": {
    "id": "507f1f77bcf86cd799439014",
    "identificationNumber": "12345678",
    "name": "Juan Pérez",
    "dateOfBirth": "1985-03-15"
  },
  "buyer": {
    "id": "507f1f77bcf86cd799439015",
    "identificationNumber": "87654321",
    "name": "María García",
    "dateOfBirth": "1990-07-22"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

## 📁 Project Structure

```
cardata-lookup-nextjs/
├── src/
│   ├── app/
│   │   ├── api/                    # Production API endpoints
│   │   └── (app)/                  # Frontend pages
│   ├── server/
│   │   ├── domain/
│   │   │   ├── entities/           # Domain entities
│   │   │   ├── usecases/           # Business logic
│   │   │   └── interfaces/         # Repository interfaces
│   │   ├── data/
│   │   │   ├── folder/             # Folder repository & schema
│   │   │   ├── vehicle/            # Vehicle repository & schema
│   │   │   ├── person/             # Person repository & schema
│   │   │   └── user/               # User repository & schema
│   │   ├── di.ts                   # Dependency injection
│   │   └── config.ts               # Configuration
│   └── models/                     # Presentation models
├── testing/
│   ├── README.md                   # Testing documentation
│   ├── postman-collection.json     # Postman collection
│   └── api/                        # Testing API endpoints
│       └── folders/
│           └── route.ts
├── ARCHITECTURE.md                 # This document
└── package.json
```

## 🔒 Security & Environment

### Environment Restrictions
- Testing endpoints are **disabled in production**
- All testing endpoints return 403 in production builds
- Production APIs should implement proper authentication

### Data Validation
- Input validation at API level
- Schema validation at database level
- Business rule validation in use cases

## 🧪 Testing Strategy

### Manual Testing
- **Postman Collection**: Complete test suite
- **curl Commands**: Quick API testing
- **Documentation**: Comprehensive testing guide

### Automated Testing (Future)
- Unit tests for domain entities
- Integration tests for repositories
- API tests for endpoints
- Performance tests for transactions

## 📈 Performance Considerations

### Database Optimization
- Compound indexes for common queries
- Transaction batching for related operations
- Connection pooling for MongoDB

### Caching Strategy (Future)
- Redis for frequently accessed data
- Query result caching
- Folder preview caching

## 🔄 Deployment Strategy

### Development
- Local MongoDB instance
- Testing endpoints enabled
- Hot reload for development

### Production
- MongoDB Atlas or self-hosted
- Testing endpoints disabled
- Proper authentication and authorization
- Rate limiting and monitoring

## 🚀 Future Enhancements

### Planned Features
- [ ] Contract generation and management
- [ ] Vehicle history tracking
- [ ] Person history tracking
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Mobile app support

### Technical Improvements
- [ ] GraphQL API for complex queries
- [ ] Event sourcing for audit trails
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Architecture**: Clean Architecture with DDD
**Database**: MongoDB with Transactions
**Framework**: Next.js 15 with TypeScript