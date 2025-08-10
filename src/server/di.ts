// import { VehicleTransactionUseCases } from "./domain/usecases/vehicle/VehicleTransactionUseCases";
import { AuthUseCase } from "./domain/usecases/auth/AuthUseCases";
import { UserRepositoryMongoDBImp } from "./data/user/UserRepositoryMongoDBImp";
// import { VehicleTransactionRepositoryMongoDBImp } from "./data/vehicle/VehicleTransactionRepositoryMongoDBImp";

import { FolderUseCases } from "./domain/usecases/folder/FolderUseCases";
import { FolderRepositoryMongoDBImp } from "./data/folder/FolderRepositoryMongoDBImp";

import { VehicleDataRetrievalUseCases } from "./domain/usecases/scraping/VehicleDataRetrievalUseCases";
import { VehicleDataRetrievalRepositoryMongoDBImp } from "./data/scraping/VehicleDataRetrievalRepositoryMongoDBImp";
import { InfraccionesVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/InfraccionesVehicleDataRetrievalUseCase";
import { DebtVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/DebtVehicleDataRetrievalUseCase";
import { MatriculaVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/MatriculaVehicleDataRetrievalUseCase";
import { PaymentAgreementVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/PaymentAgreementVehicleDataRetrievalUseCase";
import { CertificadoSuciveVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/CertificadoSuciveVehicleDataRetrievalUseCase";
import { SolicitarCertificadoVehicleDataRetrievalUseCase } from "./domain/usecases/scraping/SolicitarCertificadoVehicleDataRetrievalUseCase";

// export const vehicleTransactionUseCase = new VehicleTransactionUseCases(new VehicleTransactionRepositoryMongoDBImp());
export const authUseCase = new AuthUseCase(new UserRepositoryMongoDBImp());

// Vehicle data retrieval use cases
export const vehicleDataRetrievalUseCase = new VehicleDataRetrievalUseCases(new VehicleDataRetrievalRepositoryMongoDBImp());

// Folder use cases (with vehicle data retrieval dependency)
export const folderUseCase = new FolderUseCases(new FolderRepositoryMongoDBImp(), vehicleDataRetrievalUseCase);

export const infractionsVehicleDataRetrievalUseCase = new InfraccionesVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);
export const debtVehicleDataRetrievalUseCase = new DebtVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);
export const matriculaVehicleDataRetrievalUseCase = new MatriculaVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);
export const paymentAgreementVehicleDataRetrievalUseCase = new PaymentAgreementVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);
export const certificadoSuciveVehicleDataRetrievalUseCase = new CertificadoSuciveVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);
export const solicitarCertificadoVehicleDataRetrievalUseCase = new SolicitarCertificadoVehicleDataRetrievalUseCase(
  new VehicleDataRetrievalRepositoryMongoDBImp(), 
  folderUseCase
);