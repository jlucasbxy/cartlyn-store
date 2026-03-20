import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import type { RegisterInput } from '@/lib/validations';
import { usersRepository } from '@/repositories/users-repository';
import { ServiceError } from '@/services/service-error';

async function registerUser(data: RegisterInput) {
    const existingUser = await usersRepository.findByEmail(data.email);

    if (existingUser) {
        throw new ServiceError('Email já cadastrado', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        return await usersRepository.createUser({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            role: data.role,
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError
            && error.code === 'P2002'
        ) {
            throw new ServiceError('Email já cadastrado', 400);
        }

        throw error;
    }
}

export const registerService = {
    registerUser,
};
