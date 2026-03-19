import { Prisma } from '@prisma/client';

type NumericLike = Prisma.Decimal | number | string | null | undefined;

export function toNumber(value: NumericLike): number {
    if (value == null) return 0;

    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    if (value instanceof Prisma.Decimal) {
        return value.toNumber();
    }

    return 0;
}
