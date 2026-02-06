const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing Prisma connection with postgres:// URL...');
    console.log('');

    const notes = await prisma.note.findMany();

    console.log('✓ Query successful');
    console.log('');
    console.log('Result:', notes);
    console.log('');
    console.log('Type:', Array.isArray(notes) ? 'ARRAY' : typeof notes);
    console.log('Length:', notes.length);
    console.log('');
    console.log('✓ SUCCESS: Prisma v5 connection verified');

    process.exit(0);
  } catch (error) {
    console.error('✗ Query failed');
    console.error('Error:', error.message);
    console.error('');
    console.error('Full error:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
