import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const EditProduct = () => {
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [initialProduct, setInitialProduct] = useState(null);
    const [image, setImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false); // State untuk alert
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    useEffect(() => {
        const fetchingProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/product/${id}`);
                if (!response.ok) throw new Error("Gagal memuat product");
                const data = await response.json();
                setProduct(data);
                setInitialProduct(data); // Set initial product data
            } catch (error) {
                console.log(error);
            }
        }

        fetchingProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleEdit = async () => {
        const productData = new FormData();
        let isModified = false;

        for (const key in product) {
            if (product[key] !== initialProduct[key]) {
                productData.append(key, product[key]);
                isModified = true;
            }
        }

        if (image) {
            productData.append("image", image);
            isModified = true;
        }

        if (!isModified) {
            alert("No changes made to the product.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/product/${id}`, {
                method: 'PATCH',
                body: productData
            });

            if (!response.ok) throw new Error("Gagal mengedit produk");

            const updatedProduct = await response.json();
            setProduct(updatedProduct);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate("/profile");
            }, 3000); // Alert akan menghilang setelah 3 detik
        } catch (error) {
            console.log(error);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col h-screen bg-gray-100'>
            <Navbar />
            <div className='px-16 py-8'>
                <div className="text-md font-semibold mb-6">Edit Product</div>
                <div className="space-y-4">
                    <div className="flex items-center gap-8">
                        <label className="w-36 text-sm text-gray-700 font-medium">Product Name</label>
                        <input
                            className="flex-1 border border-gray-300 px-4 py-1 rounded-full focus:outline-none focus:ring-1 focus:ring-green-100 text-sm"
                            name="product_name"
                            value={product.product_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex text-sm items-center gap-8">
                        <label className="w-36 text-gray-700 font-medium">Product Description</label>
                        <input
                            className="flex-1 border border-gray-300 px-4 py-1 rounded-full focus:outline-none focus:ring-1 focus:ring-green-100"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex text-sm items-center gap-8">
                        <label className="w-36 text-gray-700 font-medium">Product Category</label>
                        <input
                            className="flex-1 border border-gray-300 px-4 py-1 rounded-full focus:outline-none focus:ring-1 focus:ring-green-100"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex text-sm items-center gap-8">
                        <label className="w-36 text-gray-700 font-medium">Product Stock</label>
                        <input
                            className="flex-1 border border-gray-300 px-4 py-1 rounded-full focus:outline-none focus:ring-1 focus:ring-green-100"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex text-sm items-center gap-8">
                        <label className="w-36 text-gray-700 font-medium">Product Price</label>
                        <input
                            className="flex-1 border border-gray-300 px-4 py-1 rounded-full focus:outline-none focus:ring-1 focus:ring-green-100"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex text-sm items-center gap-8">
                        <label className="w-36 text-gray-700 font-medium">Product Image</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                onChange={(event) => setImage(event.target.files[0])}
                                className="file:border file:border-gray-300 file:px-4 file:py-2 file:rounded-full file:bg-white file:text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-100"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full flex items-center'>
                    <button
                        onClick={handleEdit}
                        className="w-full mt-8 py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-800"
                    >
                        Edit
                    </button>
                </div>
            </div>
            {showAlert && (
                <div className="z-20 fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
                    Product updated successfully!
                </div>
            )}
        </div>
    );
}

export default EditProduct;
