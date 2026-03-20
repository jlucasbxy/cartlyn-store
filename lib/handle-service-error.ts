import { NextResponse } from 'next/server';
import { ServiceError } from '@/services/service-error';

export function handleServiceError(error: unknown, fallbackMessage: string) {
    if (error instanceof ServiceError) {
        return NextResponse.json(
            {
                error: error.message,
                details: error.details,
            },
            { status: error.status }
        );
    }

    console.error(fallbackMessage, error);
    return NextResponse.json(
        { error: fallbackMessage },
        { status: 500 }
    );
}
