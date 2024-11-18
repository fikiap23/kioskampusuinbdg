import React, { useState } from 'react'
import Navbar from '../Navbar.js'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext.js';

const AddProduct = () => {
    const [product_name, setName] = useState([]);
    const [description, setDescription] = useState([]);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("Books and Stationary");
    const [stock, setStock] = useState([]);
    const [price, setPrice] = useState([]);
    const { user } = useUser();
    const [showAlert, setShowAlert] = useState(false);  // State for alert visibility
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const users_id = user.user_id;
        const productData = new FormData();
        productData.append("product_name", product_name);
        productData.append("description", description);
        productData.append("image", image); 
        productData.append("category", category);
        productData.append("stock", stock);
        productData.append("price", price);
        productData.append("users_id", users_id);

        fetch("http://localhost:5000/api/product", {
            method: "POST",
            body: productData
        })
        .then((response) => {
            return response.json();
        })
        .then(() => {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false); 
                navigate('/home');  
            }, 1500);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Navbar />
            <div className='px-16 py-8 bg-gray-100'>
                <div className="font-semibold text-md pb-2">Add Product</div>
                <div className='flex flex-col gap-4 ring-1 rounded-lg p-4 text-sm font-normal'>
                    <div>
                        <p>Name</p>
                        <input 
                            value={product_name} 
                            onChange={(event) => setName(event.target.value)} 
                            placeholder='Product Name' 
                            className='pl-2 border rounded-md border-gray-400 w-full'/>
                    </div>

                    <div>
                        <p className=''>Description</p>
                        <input 
                            value={description} 
                            onChange={(event) => setDescription(event.target.value)} 
                            placeholder="Product's description" 
                            className='pl-2 border border-gray-400 rounded-md w-full'/>
                    </div>
                    
                    <div>
                        <div className='w-full rounded-md border border-gray-400 flex pl-2 items-center justify-center h-24'>
                            <input 
                                type='file' 
                                onChange={(event) => setImage(event.target.files[0])} 
                            />
                        </div>
                    </div>
                    
                    <div className='flex flex-wrap justify-around'>
                        <div>
                            <p className="text-xs">Category</p>
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="inline-flex w-56 items-center justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100">
                                    {category || 'Books and Stationary'}
                                    <IoMdArrowDropdown />
                                </MenuButton>
                                <MenuItems transition className="absolute right-0 z-99 mt-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                                    <MenuItem>
                                        <button onClick={() => setCategory("Books and Stationary")} className='w-full text-left rounded-t-md block px-4 py-1 text-xs text-gray-700'>
                                            Books and Stationary
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={() => setCategory("Clothing and Accessories")} className='w-full text-left block px-4 py-1 text-xs text-gray-700'>
                                            Clothing and Accessories
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={() => setCategory("Electronics")} className='w-full text-left block px-4 py-1 text-xs text-gray-700'>
                                            Electronics
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={() => setCategory("Foods and Beverages")} className='w-full text-left block px-4 py-1 text-xs text-gray-700'>
                                            Foods and Beverages
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={() => setCategory("Service")} className='w-full text-left block px-4 py-1 text-xs text-gray-700'>
                                            Service
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={() => setCategory("Other")} className='w-full text-left rounded-b-md block px-4 py-1 text-xs text-gray-700'>
                                            Other
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>

                        <div>
                            <p className="text-xs">Stock</p>
                            <input 
                                value={stock} 
                                onChange={(event) => setStock(event.target.value)} 
                                placeholder='Stock' 
                                className='pl-2 border border-gray-300 rounded-md'/>
                        </div>

                        <div >
                            <p className='text-xs'>Price</p>
                            <div className='flex border border-gray-300 bg-gray-300 rounded-md'>
                                <p className='px-1'>Rp</p>
                                <input 
                                    value={price} 
                                    onChange={(event) => setPrice(event.target.value)} 
                                    className='pl-2 border border-gray-300 rounded-md'/>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        className='text-white hover:bg-green-600 bg-green-400 rounded-lg mt-4 py-1'>
                        Add Product
                    </button>
                </div>
            </div>

            {showAlert && (
                <div className="fixed z-20 top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
                    Product added successfully!
                </div>
            )}
        </div>
    )
}

export default AddProduct;
