import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // On Vercel, the filesystem is read-only except for /tmp.
  // We must copy the bundled SQLite file to /tmp before instantiating Prisma.
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const tmpPath = "/tmp/dev.db";

  // Check if it already exists in this serverless container's /tmp
  if (!fs.existsSync(tmpPath)) {
    try {
      fs.copyFileSync(dbPath, tmpPath);
      console.log("Copied SQLite DB to /tmp/dev.db");
    } catch (e) {
      console.error("Failed to copy SQLite DB to /tmp", e);
    }
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:/tmp/dev.db",
      },
    },
  });
} else {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  globalForPrisma.prisma = prisma;
}

export { prisma };