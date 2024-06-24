import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { fullname, email, password } = await request.json();
        
        // con esto incripto la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        const newUser = await prisma.users.create({
            data: {
                fullname, 
                email, 
                password: hashedPassword
            }
        });

        return NextResponse.json({
            message: 'Usuario registrado',
            newUser
        }, {
            status: 200
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: error.message,
        }, {
            status: 500,
        });
    }
}
