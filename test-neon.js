const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const notes = await prisma.note.findMany();
  console.log(notes);
  await prisma.$disconnect();
}

main();
