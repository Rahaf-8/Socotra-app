import "server-only";

import { prisma } from "@/lib/prisma";

export function getAdminTourPackageTypes() {
  return prisma.tourPackageType.findMany({ orderBy: [{ displayOrder: "asc" }, { key: "asc" }], include: { translations: true, _count: { select: { tours: true } } } });
}

export async function getTourPackageTypeOptions(currentKey?: string) {
  const values = await prisma.tourPackageType.findMany({
    where: currentKey ? { OR: [{ status: "published" }, { key: currentKey }] } : { status: "published" },
    orderBy: [{ displayOrder: "asc" }, { key: "asc" }],
    include: { translations: { where: { locale: "en" }, take: 1 } },
  });
  return values.map((value) => ({ key: value.key, label: value.translations[0]?.label ?? value.key, active: value.status === "published" }));
}
