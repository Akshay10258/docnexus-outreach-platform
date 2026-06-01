import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.physician.deleteMany();
  await prisma.campaign.deleteMany();

  // 1. Create Physicians

  await prisma.physician.createMany({
    data: [
      {
        npi: "1023456780",
        firstName: "Sarah",
        lastName: "Johnson",
        specialty: "Oncology",
        subSpecialty: "Breast Oncology",
        affiliation: "Mayo Clinic",
        city: "Rochester",
        state: "MN",
        email: "sarah.johnson@mayoclinic.org",
        npiRegistrationYear: 2010,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456781",
        firstName: "Michael",
        lastName: "Chen",
        specialty: "Cardiology",
        subSpecialty: "Interventional Cardiology",
        affiliation: "Cleveland Clinic",
        city: "Cleveland",
        state: "OH",
        email: "m.chen@ccf.org",
        npiRegistrationYear: 2012,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456782",
        firstName: "Emily",
        lastName: "Rodriguez",
        specialty: "Neurology",
        subSpecialty: null,
        affiliation: "Mount Sinai",
        city: "New York",
        state: "NY",
        email: "emily.rodriguez@mountsinai.org",
        npiRegistrationYear: 2015,
        acceptingPatients: false,
        boardCertified: true,
      },
      {
        npi: "1023456783",
        firstName: "James",
        lastName: "Wilson",
        specialty: "Oncology",
        subSpecialty: "Thoracic Oncology",
        affiliation: "MD Anderson Cancer Center",
        city: "Houston",
        state: "TX",
        email: "j.wilson@mdanderson.org",
        npiRegistrationYear: 2008,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456784",
        firstName: "Aisha",
        lastName: "Patel",
        specialty: "Endocrinology",
        subSpecialty: "Diabetes & Metabolism",
        affiliation: "Johns Hopkins Hospital",
        city: "Baltimore",
        state: "MD",
        email: "apatel@jhmi.edu",
        npiRegistrationYear: 2014,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456785",
        firstName: "Robert",
        lastName: "Martinez",
        specialty: "Gastroenterology",
        subSpecialty: "Hepatology",
        affiliation: "UCLA Medical Center",
        city: "Los Angeles",
        state: "CA",
        email: "robert.martinez@mednet.ucla.edu",
        npiRegistrationYear: 2005,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456786",
        firstName: "Linda",
        lastName: "Kim",
        specialty: "Rheumatology",
        subSpecialty: null,
        affiliation: "Massachusetts General Hospital",
        city: "Boston",
        state: "MA",
        email: "lkim@mgh.harvard.edu",
        npiRegistrationYear: 2017,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456787",
        firstName: "William",
        lastName: "Davis",
        specialty: "Oncology",
        subSpecialty: "Hematology Oncology",
        affiliation: "Dana-Farber Cancer Institute",
        city: "Boston",
        state: "MA",
        email: "william_davis@dfci.harvard.edu",
        npiRegistrationYear: 2002,
        acceptingPatients: false,
        boardCertified: true,
      },
      {
        npi: "1023456788",
        firstName: "Sophia",
        lastName: "Garcia",
        specialty: "Cardiology",
        subSpecialty: "Electrophysiology",
        affiliation: "Texas Heart Institute",
        city: "Houston",
        state: "TX",
        email: "sgarcia@texasheart.org",
        npiRegistrationYear: 2011,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456789",
        firstName: "David",
        lastName: "Miller",
        specialty: "Pulmonology",
        subSpecialty: "Critical Care",
        affiliation: "Northwestern Memorial Hospital",
        city: "Chicago",
        state: "IL",
        email: "david.miller@nm.org",
        npiRegistrationYear: 2009,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456790",
        firstName: "Olivia",
        lastName: "Taylor",
        specialty: "Dermatology",
        subSpecialty: "Mohs Surgery",
        affiliation: "Stanford Health Care",
        city: "Palo Alto",
        state: "CA",
        email: "otaylor@stanford.edu",
        npiRegistrationYear: 2016,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456791",
        firstName: "Richard",
        lastName: "Anderson",
        specialty: "Oncology",
        subSpecialty: "Gastrointestinal Oncology",
        affiliation: "Memorial Sloan Kettering",
        city: "New York",
        state: "NY",
        email: "andersonr@mskcc.org",
        npiRegistrationYear: 1999,
        acceptingPatients: false,
        boardCertified: true,
      },
      {
        npi: "1023456792",
        firstName: "Isabella",
        lastName: "Thomas",
        specialty: "Endocrinology",
        subSpecialty: null,
        affiliation: "UCSF Medical Center",
        city: "San Francisco",
        state: "CA",
        email: "isabella.thomas@ucsf.edu",
        npiRegistrationYear: 2013,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456793",
        firstName: "Joseph",
        lastName: "Jackson",
        specialty: "Neurology",
        subSpecialty: "Movement Disorders",
        affiliation: "Emory University Hospital",
        city: "Atlanta",
        state: "GA",
        email: "j.jackson@emory.edu",
        npiRegistrationYear: 2007,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456794",
        firstName: "Mia",
        lastName: "White",
        specialty: "Infectious Disease",
        subSpecialty: null,
        affiliation: "Duke University Hospital",
        city: "Durham",
        state: "NC",
        email: "mia.white@duke.edu",
        npiRegistrationYear: 2018,
        acceptingPatients: true,
        boardCertified: false,
      },
      {
        npi: "1023456795",
        firstName: "Charles",
        lastName: "Harris",
        specialty: "Cardiology",
        subSpecialty: "Heart Failure",
        affiliation: "Vanderbilt University Medical Center",
        city: "Nashville",
        state: "TN",
        email: "charles.harris@vumc.org",
        npiRegistrationYear: 2004,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456796",
        firstName: "Ava",
        lastName: "Martin",
        specialty: "Oncology",
        subSpecialty: "Gynecologic Oncology",
        affiliation: "Seattle Cancer Care Alliance",
        city: "Seattle",
        state: "WA",
        email: "amartin@seattlecca.org",
        npiRegistrationYear: 2011,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456797",
        firstName: "Thomas",
        lastName: "Thompson",
        specialty: "Gastroenterology",
        subSpecialty: "Inflammatory Bowel Disease",
        affiliation: "UPMC Presbyterian",
        city: "Pittsburgh",
        state: "PA",
        email: "thompsont@upmc.edu",
        npiRegistrationYear: 2006,
        acceptingPatients: false,
        boardCertified: true,
      },
      {
        npi: "1023456798",
        firstName: "Emma",
        lastName: "Garcia",
        specialty: "Rheumatology",
        subSpecialty: "Lupus",
        affiliation: "Cedars-Sinai Medical Center",
        city: "Los Angeles",
        state: "CA",
        email: "emma.garcia@cshs.org",
        npiRegistrationYear: 2014,
        acceptingPatients: true,
        boardCertified: true,
      },
      {
        npi: "1023456799",
        firstName: "Christopher",
        lastName: "Martinez",
        specialty: "Pulmonology",
        subSpecialty: "Sleep Medicine",
        affiliation: "Barnes-Jewish Hospital",
        city: "St. Louis",
        state: "MO",
        email: "c.martinez@bjc.org",
        npiRegistrationYear: 2003,
        acceptingPatients: true,
        boardCertified: true,
      },
    ],
  });

  console.log("Seeded physicians");

  // 2. Create Realistic Campaigns for Demo

  // Find some Oncology physicians for the active campaign
  const oncologyDocs = await prisma.physician.findMany({
    where: { specialty: "Oncology" },
    select: { id: true },
    take: 5
  });

  // Find some Cardiology physicians for the draft campaign
  const cardiologyDocs = await prisma.physician.findMany({
    where: { specialty: "Cardiology" },
    select: { id: true },
    take: 3
  });

  await prisma.campaign.create({
    data: {
      name: "Q3 Oncology Clinical Trial Outreach",
      type: "cold_outbound",
      status: "active",
      senderName: "Sarah Jenkins",
      senderTitle: "Medical Science Liaison",
      senderCompany: "Novartis",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      enrolledPhysicianIds: oncologyDocs.map(d => d.id).join(","),
      sequences: {
        create: [
          {
            stepNumber: 1,
            delayDays: 0,
            subjectTemplate: "Clinical trial opportunities for {{specialty}} patients at {{affiliation}}",
            bodyTemplate: "Dear Dr. {{doctor_name}},\n\nI am reaching out because of your extensive work in oncology at {{affiliation}}. We are currently enrolling for a Phase 3 trial that aligns closely with your clinical focus.\n\nWould you be open to a brief 5-minute call next week to discuss if this would benefit your patients?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}"
          },
          {
            stepNumber: 2,
            delayDays: 4,
            subjectTemplate: "Following up: Clinical trial resources for {{specialty}}",
            bodyTemplate: "Dear Dr. {{doctor_name}},\n\nI know how busy things are at {{affiliation}}. I just wanted to float this to the top of your inbox.\n\nAre you still open to discussing the trial parameters?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}"
          }
        ]
      }
    }
  });

  await prisma.campaign.create({
    data: {
      name: "Q4 Cardiology Re-engagement",
      type: "reengagement",
      status: "draft",
      senderName: "Sarah Jenkins",
      senderTitle: "Medical Science Liaison",
      senderCompany: "Novartis",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      enrolledPhysicianIds: cardiologyDocs.map(d => d.id).join(","),
      sequences: {
        create: [
          {
            stepNumber: 1,
            delayDays: 0,
            subjectTemplate: "Reconnecting regarding new cardiovascular therapies",
            bodyTemplate: "Dear Dr. {{doctor_name}},\n\nIt's been a while since we last connected. I wanted to share some recent data regarding our new cardiovascular therapies that might be relevant to your work at {{affiliation}}.\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}"
          }
        ]
      }
    }
  });

  console.log("Seeded realistic demo campaigns");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());