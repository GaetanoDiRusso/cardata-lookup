export interface PPerson {
    id: string;
    identificationNumber: string; // Unique identifier that never changes
    name: string;
    dateOfBirth: string;
}

export interface PPersonPrev {
    id: string;
    name: string;
    identificationNumber: string;
}