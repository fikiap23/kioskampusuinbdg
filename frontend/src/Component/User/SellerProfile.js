import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CardProduct from '../CardProduct.mjs';
import Navbar from '../Navbar';
import CardSellerProduct from '../Product/CardSellerProduct';

const SellerProfile = () => {
    const location = useLocation();
    const [seller, setSeller] = useState(null); 
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log(id);

    useEffect(() => {
        const fetchingSellerData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Penjual");
                }
                const data = await response.json();
                setSeller(data);

                const sellerProductResponse = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!sellerProductResponse.ok) {
                    throw new Error("Gagal mengambil produk Seller");
                }
                const productData = await sellerProductResponse.json();
                setProducts(productData);
            } catch (error) {
                setError(error.message);
                console.error('Terjadi kesalahan:', error);
            }
        };

        fetchingSellerData();
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!seller || !products) {
        return <div>Loading...</div>;
    }

    const whatsappLink = seller
    ? `https://wa.me/${seller.no_wa}`
    : '#';

    return (
        <div>
            <Navbar />
            <div className='py-8 px-16'>
                <div className='text-xl font-semibold'>{seller.name}</div>
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center px-6 py-1 text-white font-semibold bg-green-500 rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                    >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2C6.477 2 2 6.478 2 12c0 1.748.43 3.4 1.184 4.855L2 22l5.193-1.167C8.587 21.57 10.244 22 12 22c5.523 0 10-4.478 10-10s-4.477-10-10-10zm0 18c-1.542 0-3.043-.39-4.358-1.124L6 19l.903-2.388C5.934 15.345 5.5 13.718 5.5 12 5.5 7.857 8.857 4.5 12 4.5S18.5 7.857 18.5 12 15.143 19.5 12 19.5zm4.228-6.544c-.218-.11-1.292-.639-1.493-.71-.2-.07-.346-.11-.492.11-.145.22-.564.709-.69.855-.126.145-.255.164-.473.055-.218-.11-.92-.337-1.751-1.076-.647-.557-1.081-1.247-1.21-1.465-.13-.219-.014-.34.096-.45.098-.097.218-.255.327-.383.11-.128.145-.219.218-.364.072-.146.036-.274-.018-.383-.055-.11-.492-1.186-.674-1.624-.178-.434-.362-.372-.492-.373-.127 0-.273-.01-.419-.01-.146 0-.382.054-.582.274-.2.22-.764.746-.764 1.825s.784 2.123.894 2.272c.11.146 1.544 2.364 3.735 3.32.523.225.932.359 1.25.46.524.165 1.003.142 1.383.086.42-.063 1.292-.528 1.474-1.037.182-.51.182-.946.127-1.037-.055-.09-.2-.146-.418-.255z" />
                    </svg>
                    Chat Seller on WhatsApp
                </a>

                <div className='my-8 text-sm'>
                    <div className='text-xs font-medium py-2'>{seller.name}'s Product</div>
                    <div>
                        {products.map((product) => (
                            <Link to={`/product-detail?id=${product.product_id}`}>
                                <CardSellerProduct key={product.id} data={product} />
                            </Link>
                            
                        ))}
                    </div>
                </div>      
            </div>   
        </div>
    );
};

export default SellerProfile;