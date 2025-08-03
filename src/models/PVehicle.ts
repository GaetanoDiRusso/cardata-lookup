export interface PVehicle {
    id: string;
    registrationNumber: string; // Unique identifier that never changes
    plateNumber: string; // Can change over time
    brand: string;
    model: string;
    year: number;
}

export interface PVehiclePrev {
    id: string;
    registrationNumber: string;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
}