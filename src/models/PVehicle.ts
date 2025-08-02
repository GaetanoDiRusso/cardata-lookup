export interface PVehicle {
    id: string,
    plateNumber: string;
    registrationNumber: string;
    department: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    cylinders: number;
    fuel: string;
    attribute: string;
    engineCapacity: number;
    totalWeight: number;
    engineNumber: string;
    chassisNumber: string;
    axles: number;
    passengers: number;
    ownerName: string;
    ownerIdentification: string;
}

export interface PVehiclePrev {
    id: string,
    plateNumber: string;
    registrationNumber: string;
    brand: string;
    model: string;
    year: number;
}