import { Cafe, Prisma } from "generated/prisma";

export type CafeWithLineup = Prisma.CafeGetPayload<{ include: { lineup: true } }>;
export type CafeWithLatestReported = Cafe & {
    latest_reported_date: Date | null;
};