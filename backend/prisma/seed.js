const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const users = [
  { username: "admin", password: process.env.SEED_ADMIN_PASSWORD || "changeme" },
  { username: "anis", password: process.env.SEED_ANIS_PASSWORD || "changeme" },
  { username: "inara", password: process.env.SEED_INARA_PASSWORD || "changeme" },
];

async function main() {
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: { password: hashed },
      create: { username: u.username, password: hashed },
    });
    console.log(`Seeded user: ${u.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
