// import { VehicleTransactionUseCases } from "./domain/usecases/vehicle/VehicleTransactionUseCases";
import { AuthUseCase } from "./domain/usecases/auth/AuthUseCases";
import { UserRepositoryMongoDBImp } from "./data/user/UserRepositoryMongoDBImp";
// import { VehicleTransactionRepositoryMongoDBImp } from "./data/vehicle/VehicleTransactionRepositoryMongoDBImp";

import { FolderUseCases } from "./domain/usecases/folder/FolderUseCases";
import { FolderRepositoryMongoDBImp } from "./data/folder/FolderRepositoryMongoDBImp";

import { VehicleDataRetrievalUseCases } from "./domain/usecases/scraping/VehicleDataRetrievalUseCases";
import { VehicleDataRetrievalRepositoryMongoDBImp } from "./data/scraping/VehicleDataRetrievalRepositoryMongoDBImp";
import { InfractionsVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/InfraccionesVehicleDataRetrievalUseCase";

// export const vehicleTransactionUseCase = new VehicleTransactionUseCases(new VehicleTransactionRepositoryMongoDBImp());
export const folderUseCase = new FolderUseCases(new FolderRepositoryMongoDBImp());
export const authUseCase = new AuthUseCase(new UserRepositoryMongoDBImp());

// Vehicle data retrieval use cases
export const vehicleDataRetrievalUseCase = new VehicleDataRetrievalUseCases(new VehicleDataRetrievalRepositoryMongoDBImp());
export const infractionsVehicleDataRetrievalUseCase = new InfractionsVehicleDataRetrievalUseCase(vehicleDataRetrievalUseCase, folderUseCase);