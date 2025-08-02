import { IVehicleTransactionRepository, CreateVehicleTransactionDTO } from "@/server/domain/interfaces/IFolderRepository";
import VehicleTransactionSchema, { VehicleTransactionSchemaToPVehicleTransaction } from "./VehicleTransactionSchema";
import { PVehicleTransaction } from "@/models/PFolder";
import PersonSchema from "../person/PersonSchema";
import { connectDB } from "../mongodb";
import UserSchema from "../user/UserSchema";

export class VehicleTransactionRepositoryMongoDBImp implements IVehicleTransactionRepository {
    constructor() {}

    async createVehicleTransaction(vehicleTransaction: CreateVehicleTransactionDTO): Promise<PVehicleTransaction> {
        await connectDB()

        let buyer = await PersonSchema.findOne({ identificationNumber: vehicleTransaction.buyer.identificationNumber });

        if (!buyer) {
            buyer = await PersonSchema.create(vehicleTransaction.buyer);
        }

        let seller = await PersonSchema.findOne({ identificationNumber: vehicleTransaction.seller.identificationNumber });

        if (!seller) {
            seller = await PersonSchema.create(vehicleTransaction.seller);
        }

        const createdByUser = await UserSchema.findById(vehicleTransaction.createdByUserId);

        if (!createdByUser) {
            throw new Error('User not found');
        }

        const result = await VehicleTransactionSchema.create({
            createdBy: createdByUser._id,
            vehicle: vehicleTransaction.vehicle,
            buyer: buyer._id,
            seller: seller._id,
            buyerExtraData: vehicleTransaction.buyerExtraData,
            sellerExtraData: vehicleTransaction.sellerExtraData,
        }).then(r => r.populate(['buyer', 'seller']));

        return VehicleTransactionSchemaToPVehicleTransaction(result);
    }
}