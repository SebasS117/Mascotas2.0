import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const races = await prisma.races.findMany();
        return NextResponse.json(races, { status: 200 });
    } catch (error) {
        console.log('Error fetching races:', error);
        return NextResponse.json({
            message: 'Error fetching races',
        }, {
            status: 500,
        });
    }
}
