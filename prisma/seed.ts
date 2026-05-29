import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.physician.deleteMany();

  await prisma.physician.createMany({
    data: [
      {
        npi: "1234567890",
        firstName: "Sarah",
        lastName: "Johnson",
        specialty: "Oncology",
        subSpecialty: "Breast Oncology",
        affiliation: "Mayo Clinic",
        city: "Rochester",
        state: "MN",
        email: "sarah.johnson@example.com",
        npiRegistrationYear: 2010,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1234567891",
        firstName: "Michael",
        lastName: "Chen",
        specialty: "Cardiology",
        subSpecialty: "Interventional Cardiology",
        affiliation: "Cleveland Clinic",
        city: "Cleveland",
        state: "OH",
        email: "michael.chen@example.com",
        npiRegistrationYear: 2012,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1234567892",
        firstName: "Emily",
        lastName: "Rodriguez",
        specialty: "Neurology",
        subSpecialty: null,
        affiliation: "Mount Sinai",
        city: "New York",
        state: "NY",
        email: "emily.rodriguez@example.com",
        npiRegistrationYear: 2015,
        acceptingPatients: false,
        boardCertified: true,
      },
    ],
  });

  console.log("Seeded physicians");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());