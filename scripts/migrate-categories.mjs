import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive migration: Updating "Child Welfare" to "Child Wellbeing"...');

  // 1. Update Categories (Exact and Case-Insensitive)
  const programCatUpdate = await prisma.program.updateMany({
    where: { category: { equals: 'Child Welfare', mode: 'insensitive' } },
    data: { category: 'Child Wellbeing' },
  });
  console.log(`Updated ${programCatUpdate.count} program categories.`);

  const storyCatUpdate = await prisma.impactStory.updateMany({
    where: { category: { equals: 'Child Welfare', mode: 'insensitive' } },
    data: { category: 'Child Wellbeing' },
  });
  console.log(`Updated ${storyCatUpdate.count} impact story categories.`);

  // 2. Update Titles, Descriptions, and Content where "Child Welfare" appears
  // We'll fetch records that contain the string and do a replacement.

  const programs = await prisma.program.findMany({
    where: {
      OR: [
        { title: { contains: 'Child Welfare', mode: 'insensitive' } },
        { description: { contains: 'Child Welfare', mode: 'insensitive' } },
      ]
    }
  });

  for (const p of programs) {
    await prisma.program.update({
      where: { id: p.id },
      data: {
        title: p.title.replace(/Child Welfare/gi, 'Child Wellbeing'),
        description: p.description.replace(/Child Welfare/gi, 'Child Wellbeing'),
      }
    });
  }
  console.log(`Updated ${programs.length} programs containing "Child Welfare" in title/description.`);

  const stories = await prisma.impactStory.findMany({
    where: {
      OR: [
        { title: { contains: 'Child Welfare', mode: 'insensitive' } },
        { content: { contains: 'Child Welfare', mode: 'insensitive' } },
      ]
    }
  });

  for (const s of stories) {
    await prisma.impactStory.update({
      where: { id: s.id },
      data: {
        title: s.title.replace(/Child Welfare/gi, 'Child Wellbeing'),
        content: s.content.replace(/Child Welfare/gi, 'Child Wellbeing'),
      }
    });
  }
  console.log(`Updated ${stories.length} impact stories containing "Child Welfare" in title/content.`);

  console.log('Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
