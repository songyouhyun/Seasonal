import { Prisma } from "generated/prisma";

const cafeWithLatestReported = Prisma.validator<Prisma.CafeDefaultArgs>()({
  include: {
    lineup: {
      select: { reported_date: true },
      orderBy: { reported_date: 'desc' },
      take: 1,
    },
  },
});

export type CafeWithLineup = Prisma.CafeGetPayload<{ include: { lineup: true } }>;
export type CafeWithLatestReported = Prisma.CafeGetPayload<typeof cafeWithLatestReported>;