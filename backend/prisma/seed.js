const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// EDIT THESE to your real users before running
const users = [
  { username: "admin", password: "ChangeMe123!" },
  { username: "anis", password: "ChangeMe456!" },
  { username: "inara", password: "ChangeMe789!" },
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
