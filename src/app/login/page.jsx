"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import "../globals.css";
import { toast } from 'react-toastify';

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Response:', response);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        toast.success('Inicio de sesión exitoso'); 
        window.location.href = '/mascotas';
      }
    } catch (err) {
      console.log('Error:', err.response.data);
      toast.error(err.response.data.message || 'Credenciales incorrectas, por favor intente nuevamente.'); 
      setError(err.response.data.message || 'Credenciales incorrectas, por favor intente nuevamente.');
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-blue-200'>
      <div className='container-login w-[360px] h-[640px] flex flex-col justify-end rounded-[30px] p-3'>
        <div className='flex flex-col gap-3'>
          <input 
            type="email" 
            placeholder='Correo electrónico' 
            className='px-4 py-[10px] rounded-[50px] bg-white bg-opacity-60 placeholder-blue-400 outline-none'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder='Contraseña' 
            className='px-4 py-[10px] rounded-[50px] bg-white bg-opacity-60 placeholder-blue-400 outline-none'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className='text-red-500'>{error}</p>}
          <button 
            className='bg-blue-800 hover:bg-blue-700 py-[10px] w-full rounded-full text-white text-[1em]'
            onClick={handleLogin}
          >
            Ingresar
          </button>

          <Link href="/users">
            <button className='bg-blue-800 hover:bg-blue-700 py-[10px] w-full rounded-full text-white text-[1em]'>Registrar</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
