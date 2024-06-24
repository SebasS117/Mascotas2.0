import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const pets = await prisma.pets.findMany({
            include: {
                fk_race: true,
                fk_category: true,
                fk_gender: true
            }
        });
        return NextResponse.json(pets, { status: 200 });
    } catch (error) {
        console.log('Error fetching pets:', error);
        return NextResponse.json({
            message: 'Error fetching pets',
        }, {
            status: 500,
        });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const race_id = parseInt(formData.get('race_id'), 10);
        const category_id = parseInt(formData.get('category_id'), 10);
        const photo = formData.get('photo');
        const gender_id = parseInt(formData.get('gender_id'), 10);

        if (isNaN(race_id) || isNaN(category_id) || !photo) {
            throw new Error('Invalid input');
        }

        const photoBuffer = await photo.arrayBuffer();
        const photoPath = join(process.cwd(), 'public', 'img', photo.name);
        writeFileSync(photoPath, Buffer.from(photoBuffer));

        console.log('Form Data:', { name, race_id, category_id, photo: photo.name, gender_id });

        const newPet = await prisma.pets.create({
            data: {
                name,
                race_id,
                category_id,
                photo: photo.name,
                gender_id,
            },
        });

        return NextResponse.json(newPet, { status: 200 });
    } catch (error) {
        console.log('Error creating pet:', error.message); 
        console.log('Stack Trace:', error.stack); 
        return NextResponse.json({
            message: 'Error creating pet',
            error: error.message 
        }, {
            status: 500,
        });
    }
}
