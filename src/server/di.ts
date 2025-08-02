// import { VehicleTransactionUseCases } from "./domain/usecases/vehicle/VehicleTransactionUseCases";
import { AuthUseCase } from "./domain/usecases/auth/AuthUseCases";
import { UserRepositoryMongoDBImp } from "./data/user/UserRepositoryMongoDBImp";
// import { VehicleTransactionRepositoryMongoDBImp } from "./data/vehicle/VehicleTransactionRepositoryMongoDBImp";

import { FolderUseCases } from "./domain/usecases/folder/FolderUseCases";
import { FolderRepositoryMongoDBImp } from "./data/folder/FolderRepositoryMongoDBImp";

// export const vehicleTransactionUseCase = new VehicleTransactionUseCases(new VehicleTransactionRepositoryMongoDBImp());
export const folderUseCase = new FolderUseCases(new FolderRepositoryMongoDBImp());
export const authUseCase = new AuthUseCase(new UserRepositoryMongoDBImp());