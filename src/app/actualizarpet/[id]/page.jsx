"use client";
import React, { useEffect, useState } from 'react';
import { IoBackspaceSharp } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

function Page({ params }) {
    const router = useRouter();
    const [pet, setPet] = useState({
        name: '',
        race_id: '',
        category_id: '',
        photo: '',
        gender_id: ''
    });

    const [races, setRaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            fetchPet();
            fetchRaces();
            fetchCategories();
            fetchGenders();
        }
    }, [params.id]);

    const fetchPet = async () => {
        try {
            const response = await axios.get(`/api/mascota/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPet(response.data);
        } catch (error) {
            console.log('Error fetching pet data:', error);
            if (error.response && error.response.status === 401) {
                router.push('/login');
            }
        }
    };

    const fetchRaces = async () => {
        try {
            const response = await axios.get('/api/raza', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRaces(response.data);
        } catch (error) {
            console.log('Error fetching races:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };

    const fetchGenders = async () => {
        try {
            const response = await axios.get('/api/gender', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setGenders(response.data);
        } catch (error) {
            console.log('Error fetching genders:', error);
        }
    };

    const handleChange = (e) => {
        setPet({
            ...pet,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', pet.name);
            formData.append('race_id', pet.race_id);
            formData.append('category_id', pet.category_id);
            formData.append('photo', file ? file : pet.photo);
            formData.append('gender_id', pet.gender_id);

            const response = await axios.put(`/api/mascota/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                toast.success('Mascota actualizada'); // Notificación exitosa
                router.push('/mascotas');
            }
        } catch (error) {
            console.log('Error updating pet:', error);
            toast.error('Error actualizando la mascota'); // Notificación de error
            if (error.response && error.response.status === 401) {
                router.push('/login');
            }
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center bg-blue-200'>
            <div className='bg-blue-800 w-[360px] h-[640px] flex flex-col justify-between rounded-3xl px-5'>
                <div className='w-full flex items-center pt-8'>
                    <h1 className='text-white text-[1.2em] w-full'>Modificar Mascota</h1>
                    <button onClick={() => router.back()} className='hover:bg-blue-700 flex items-center justify-center h-[40px] w-[40px] rounded-full text-white text-3xl'><IoBackspaceSharp /></button>
                </div>
                <div className='w-full flex justify-center'>
                    {file ? (
                        <img src={URL.createObjectURL(file)} alt="Foto" className='h-[110px] w-[110px] rounded-full border-4 border-blue-400' />
                    ) : (
                        <img src={`/img/${pet.photo}`} alt="Foto" className='h-[110px] w-[110px] rounded-full border-4 border-blue-400' />
                    )}
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <input type="text" placeholder='Nombre' name='name' value={pet.name} onChange={handleChange} className='px-4 py-[12px] rounded-[50px] bg-white bg-opacity-60 placeholder-gray-500 outline-none'/>
                    <select name='race_id' value={pet.race_id} onChange={handleChange} className='px-4 py-[14px] rounded-[50px] bg-white bg-opacity-60 outline-none'>
                        <option value="" className='text-gray-500 p-2'>Seleccione Raza...</option>
                        {races.map(race => (
                            <option key={race.id} value={race.id} className='text-black p-2'>{race.name}</option>
                        ))}
                    </select>
                    <select name='category_id' value={pet.category_id} onChange={handleChange} className='px-4 py-[14px] rounded-[50px] bg-white bg-opacity-60 outline-none'>
                        <option value="" className='text-gray-500 p-2'>Seleccione Categoría...</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id} className='text-black p-2'>{category.name}</option>
                        ))}
                    </select>
                    <input type="file" name='photo' onChange={handleFileChange} className='px-4 py-[12px] rounded-[50px] bg-white bg-opacity-60 placeholder-gray-500 outline-none'/>
                    <select name='gender_id' value={pet.gender_id} onChange={handleChange} className='px-4 py-[14px] rounded-[50px] bg-white bg-opacity-60 outline-none'>
                        <option value="" className='text-gray-500 p-2'>Seleccione Género...</option>
                        {genders.map(gender => (
                            <option key={gender.id} value={gender.id} className='text-black p-2'>{gender.name}</option>
                        ))}
                    </select>
                    <button type="submit" className='bg-green-600 hover:bg-green-700 py-[10px] rounded-full text-white text-[1em] mb-4'>Actualizar</button>
                </form>
            </div>
        </div>
    );
}

export default Page;
