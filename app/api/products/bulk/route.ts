import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';
import { csvProductSchema } from '@/lib/validations';

export async function POST(request: Request): Promise<Response> {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SELLER') {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        const text = await file.text();

        return new Promise((resolve) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        const validProducts = [];
                        const errors = [];

                        for (let i = 0; i < results.data.length; i++) {
                            const row = results.data[i];
                            const validated = csvProductSchema.safeParse(row);

                            if (validated.success) {
                                validProducts.push({
                                    ...validated.data,
                                    sellerId: session.user.id,
                                });
                            } else {
                                errors.push({
                                    row: i + 1,
                                    errors: validated.error.issues,
                                });
                            }
                        }

                        if (validProducts.length === 0) {
                            resolve(
                                NextResponse.json(
                                    { error: 'Nenhum produto válido encontrado', errors },
                                    { status: 400 }
                                )
                            );
                            return;
                        }

                        // Use createMany for better performance with large datasets
                        const result = await prisma.product.createMany({
                            data: validProducts,
                            skipDuplicates: true,
                        });

                        resolve(
                            NextResponse.json({
                                message: `${result.count} produtos criados com sucesso`,
                                created: result.count,
                                errors: errors.length > 0 ? errors : undefined,
                            })
                        );
                    } catch (error) {
                        console.error('Bulk product creation error:', error);
                        resolve(
                            NextResponse.json(
                                { error: 'Erro ao criar produtos em massa' },
                                { status: 500 }
                            )
                        );
                    }
                },
                error: (error: Error) => {
                    console.error('CSV parsing error:', error);
                    resolve(
                        NextResponse.json(
                            { error: 'Erro ao processar arquivo CSV' },
                            { status: 400 }
                        )
                    );
                },
            });
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json(
            { error: 'Erro ao processar requisição' },
            { status: 500 }
        );
    }
}
