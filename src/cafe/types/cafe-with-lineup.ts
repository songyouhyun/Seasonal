import { Prisma } from "generated/prisma";

export type CafeWithLineup = Prisma.CafeGetPayload<{ include: { lineup: true } }>;