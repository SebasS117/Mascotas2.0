import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log('Received email and password:', email, password);
        
        const user = await prisma.users.findUnique({
            where: { email }
        });

        console.log('User found:', user);

        if (!user) {
            return NextResponse.json({
                message: 'Credenciales incorrectas',
            }, {
                status: 401,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return NextResponse.json({
                message: 'Credenciales incorrectas',
            }, {
                status: 401,
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h', 
        });

        return NextResponse.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        }, {
            status: 200,
        });

    } catch (error) {
        console.log('Error during authentication:', error);
        return NextResponse.json({
            message: error.message,
        }, {
            status: 500,
        });
    }
}
