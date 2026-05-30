export const SPECIALTIES = [
    "All Specialties", "Oncology", "Cardiology", "Neurology", "Orthopedics",
    "Pediatrics", "Dermatology", "Gastroenterology", "Pulmonology",
    "Endocrinology", "Rheumatology",
] as const;

export const STATES = [
    { value: "All States", label: "All States" },
    { value: "AL", label: "AL - Alabama" },
    { value: "AK", label: "AK - Alaska" },
    { value: "AZ", label: "AZ - Arizona" },
    { value: "AR", label: "AR - Arkansas" },
    { value: "CA", label: "CA - California" },
    { value: "CO", label: "CO - Colorado" },
    { value: "CT", label: "CT - Connecticut" },
    { value: "DE", label: "DE - Delaware" },
    { value: "FL", label: "FL - Florida" },
    { value: "GA", label: "GA - Georgia" },
    { value: "HI", label: "HI - Hawaii" },
    { value: "ID", label: "ID - Idaho" },
    { value: "IL", label: "IL - Illinois" },
    { value: "IN", label: "IN - Indiana" },
    { value: "IA", label: "IA - Iowa" },
    { value: "KS", label: "KS - Kansas" },
    { value: "KY", label: "KY - Kentucky" },
    { value: "LA", label: "LA - Louisiana" },
    { value: "ME", label: "ME - Maine" },
    { value: "MD", label: "MD - Maryland" },
    { value: "MA", label: "MA - Massachusetts" },
    { value: "MI", label: "MI - Michigan" },
    { value: "MN", label: "MN - Minnesota" },
    { value: "MS", label: "MS - Mississippi" },
    { value: "MO", label: "MO - Missouri" },
    { value: "MT", label: "MT - Montana" },
    { value: "NE", label: "NE - Nebraska" },
    { value: "NV", label: "NV - Nevada" },
    { value: "NH", label: "NH - New Hampshire" },
    { value: "NJ", label: "NJ - New Jersey" },
    { value: "NM", label: "NM - New Mexico" },
    { value: "NY", label: "NY - New York" },
    { value: "NC", label: "NC - North Carolina" },
    { value: "ND", label: "ND - North Dakota" },
    { value: "OH", label: "OH - Ohio" },
    { value: "OK", label: "OK - Oklahoma" },
    { value: "OR", label: "OR - Oregon" },
    { value: "PA", label: "PA - Pennsylvania" },
    { value: "RI", label: "RI - Rhode Island" },
    { value: "SC", label: "SC - South Carolina" },
    { value: "SD", label: "SD - South Dakota" },
    { value: "TN", label: "TN - Tennessee" },
    { value: "TX", label: "TX - Texas" },
    { value: "UT", label: "UT - Utah" },
    { value: "VT", label: "VT - Vermont" },
    { value: "VA", label: "VA - Virginia" },
    { value: "WA", label: "WA - Washington" },
    { value: "WV", label: "WV - West Virginia" },
    { value: "WI", label: "WI - Wisconsin" },
    { value: "WY", label: "WY - Wyoming" },
] as const;

export const AFFILIATIONS = [
    "All Affiliations", "Memorial Sloan Kettering", "Mayo Clinic", "Cleveland Clinic", 
    "Johns Hopkins Hospital", "Mount Sinai", "Massachusetts General Hospital",
    "UCLA Medical Center", "Cedars-Sinai Medical Center", "Stanford Health Care",
] as const;

export const SPECIALTY_COLORS: Record<string, string> = {
    Oncology: "#0F6E56", Cardiology: "#185FA5", Neurology: "#534AB7",
    Orthopedics: "#993C1D", Pediatrics: "#3B6D11", Dermatology: "#993556",
    Gastroenterology: "#854F0B", Pulmonology: "#0C447C", Endocrinology: "#3C3489",
    Rheumatology: "#712B13",
};

export const SPECIALTY_BG: Record<string, string> = {
    Oncology: "#E1F5EE", Cardiology: "#E6F1FB", Neurology: "#EEEDFE",
    Orthopedics: "#FAECE7", Pediatrics: "#EAF3DE", Dermatology: "#FBEAF0",
    Gastroenterology: "#FAEEDA", Pulmonology: "#E6F1FB", Endocrinology: "#EEEDFE",
    Rheumatology: "#FAECE7",
};

export function getSpecialtyColors(specialty: string) {
    return {
        color: SPECIALTY_COLORS[specialty] ?? "#5F5E5A",
        bg: SPECIALTY_BG[specialty] ?? "#F1EFE8",
    };
}

export function getInitials(firstName: string, lastName: string) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function getExperience(npiRegistrationYear: number) {
    return new Date().getFullYear() - npiRegistrationYear;
}