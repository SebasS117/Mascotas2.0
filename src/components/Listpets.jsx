"use client";
import React, { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

function Listpets() {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [petsPerPage] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            listarPets();
        }
    }, []);

    const listarPets = async () => {
        try {
            const response = await axios.get('/api/mascota', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPets(response.data);
        } catch (error) {
            console.log('Error fetching pets:', error);
            if (error.response && error.response.status === 401) {
                router.push('/login');
            }
        }
    };

    const eliminarPet = async (id) => {
        try {
            const response = await axios.delete(`/api/mascota/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                toast.success('Mascota eliminada'); 
                listarPets();
            }
        } catch (error) {
            console.log('Error deleting pet:', error);
            toast.error('No se pudo eliminar la mascota'); 
            if (error.response && error.response.status === 401) {
                router.push('/login');
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const filteredPets = pets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * petsPerPage;
    const currentPageData = filteredPets.slice(offset, offset + petsPerPage);
    const pageCount = Math.ceil(filteredPets.length / petsPerPage);

    return (
        <div className='overflow-auto mt-3 h-[80%]'>
            <h2 className='text-xl font-bold mb-4'>Total de Mascotas: {filteredPets.length}</h2>
            <input 
                type="text" 
                placeholder="Buscar mascota..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="px-4 py-2 mb-4 rounded-md"
            />
            {currentPageData.map((pet, index) => (
                <div key={pet.id} className='flex justify-between items-center bg-gray-200 hover:bg-gray-300 p-4 my-3 rounded-xl'>
                    <div className='flex items-center gap-4'>
                        <img className='h-[65px] w-[65px] bg-yellow-400 rounded-full' src={`/img/${pet.photo}`} alt='foto perro' />
                        <div>
                            <p className='font-bold'>{index + 1 + offset}. {pet.name}</p>
                            <p className='text-[0.8em]'>{pet.fk_race.name}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Link href={`/mascotainfo/${pet.id}`} className='h-[35px] w-[35px] flex justify-center items-center rounded-full bg-blue-700 hover:bg-blue-600 text-white text-xl'><ImSearch/></Link>
                        <button onClick={() => router.push(`/actualizarpet/${pet.id}`)} className='h-[35px] w-[35px] flex justify-center items-center rounded-full bg-blue-700 hover:bg-blue-600 text-white text-xl'><FaPencilAlt/></button>
                        <button onClick={() => { eliminarPet(pet.id) }} className='h-[35px] w-[35px] flex justify-center items-center rounded-full bg-red-600 hover:bg-red-500 text-white text-xl'><AiFillDelete/></button>
                    </div>
                </div>
            ))}
            <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'flex justify-center items-center mt-4'}
                pageClassName={'mx-1'}
                pageLinkClassName={'px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300'}
                previousClassName={'mx-1'}
                previousLinkClassName={'px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300'}
                nextClassName={'mx-1'}
                nextLinkClassName={'px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300'}
                breakClassName={'mx-1'}
                breakLinkClassName={'px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300'}
                activeClassName={'bg-blue-500 text-white'}
            />
        </div>
    );
}

export default Listpets;
