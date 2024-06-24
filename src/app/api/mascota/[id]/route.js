import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    let idPet = Number(params.id);
    const response = await prisma.pets.delete({ where: { id: idPet } });
    return NextResponse.json(
      { message: 'Mascota eliminada', response },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'No se pudo eliminar la mascota' },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    let idPet = Number(params.id);
    const formData = await request.formData();
    const name = formData.get('name');
    const race_id = parseInt(formData.get('race_id'), 10);
    const category_id = parseInt(formData.get('category_id'), 10);
    const photo = formData.get('photo');
    const gender_id = parseInt(formData.get('gender_id'), 10);

    if (isNaN(race_id) || isNaN(category_id) || !photo) {
      throw new Error('Invalid input');
    }

    let photoPath;
    if (photo instanceof File) {
      const photoBuffer = await photo.arrayBuffer();
      photoPath = join(process.cwd(), 'public', 'img', photo.name);
      writeFileSync(photoPath, Buffer.from(photoBuffer));
    }

    const response = await prisma.pets.update({
      where: { id: idPet },
      data: { 
        name, 
        race_id, 
        category_id, 
        photo: photo instanceof File ? photo.name : photo, 
        gender_id 
      }
    });

    return new Response(
      JSON.stringify({ message: 'Mascota actualizada', response }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

export async function GET(request, { params }) {
  let idPet = Number(params.id);
  try {
    const response = await prisma.pets.findUnique({
      where: { id: idPet },
      include: {
        fk_race: true,
        fk_category: true,
        fk_gender: true
      }
    });
    if (response) {
      return new Response(
        JSON.stringify(response),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'No se encontró la mascota' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
