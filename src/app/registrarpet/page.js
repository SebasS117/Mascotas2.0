"use client"; 

import Petsform from "@/components/Petsform";
import Link from "next/link";
import React, { useEffect } from "react";
import { IoBackspaceSharp } from "react-icons/io5";
import { useRouter } from 'next/navigation';

function page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div className='w-full h-screen flex justify-center items-center bg-blue-200'>
      <div className='bg-blue-800 w-[360px] h-[640px] flex flex-col justify-between rounded-3xl px-5'>
          <div className='w-full flex items-center pt-8'>
            <h1 className='text-white text-[1.2em] w-full'>Adicionar Mascota</h1>
            <Link href="/mascotas" className='hover:bg-blue-700 flex items-center justify-center h-[40px] w-[40px] rounded-full text-white text-3xl'><IoBackspaceSharp/></Link>
          </div>
          <Petsform />
      </div>
    </div>
  )
}

export default page;
