"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UsersForm() {
    const [users, setUsers] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUsers({
            ...users,
            [e.target.name]: e.target.value,
        });
    };

    const limpUsers = () => {
        setUsers({
            fullname: "",
            email: "",
            password: ""
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('/api/users', users);
            if (res.status === 200) {
                toast.success('Usuario registrado con éxito'); 
                limpUsers();
            }
        } catch (error) {
            console.error('El error es', error);
            toast.error('No se pudo registrar el usuario'); 
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <input 
                    type="text" 
                    placeholder='Nombre' 
                    className='px-4 py-[12px] rounded-[50px] bg-white bg-opacity-60 placeholder-gray-500 outline-none' 
                    name='fullname' 
                    value={users.fullname} 
                    onChange={handleChange} 
                />
                <input 
                    type="email" 
                    placeholder='Correo' 
                    className='px-4 py-[12px] rounded-[50px] bg-white bg-opacity-60 placeholder-gray-500 outline-none' 
                    name='email' 
                    value={users.email} 
                    onChange={handleChange} 
                />
                <input 
                    type="password" 
                    placeholder='Contraseña' 
                    className='px-4 py-[12px] rounded-[50px] bg-white bg-opacity-60 placeholder-gray-500 outline-none' 
                    name='password' 
                    value={users.password} 
                    onChange={handleChange} 
                />
                <button className='bg-green-600 hover:bg-green-700 py-[10px] rounded-full text-white text-[1em] mb-4'>Guardar</button>
            </form>
        </div>
    );
}

export default UsersForm;
