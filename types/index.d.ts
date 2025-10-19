
export type ProductWithSeller = Prisma.ProductGetPayload<{
    include: {
        seller: true
    }
}>
