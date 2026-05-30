export interface Physician {
    id: string;
    npi: string;
    firstName: string;
    lastName: string;
    specialty: string;
    subSpecialty: string | null;
    affiliation: string;
    city: string;
    state: string;
    email: string;
    npiRegistrationYear: number;
    acceptingPatients: boolean;
    boardCertified: boolean;
}

export interface PhysicianFilters {
    specialty: string;
    state: string;
    minYear: string;
    acceptingOnly: boolean;
    boardOnly: boolean;
    search: string;
}