import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const skills = [
    {
      name: 'Skill 1',
    },
    {
      name: 'Skill 2',
    },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
