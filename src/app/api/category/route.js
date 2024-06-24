import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.categories.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.log('Error fetching categories:', error);
        return NextResponse.json({
            message: 'Error fetching categories',
        }, {
            status: 500,
        });
    }
}
