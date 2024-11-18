import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Navbar from '../Navbar'

const ProductDetail = () => {
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/product/${id}`)
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk')
        }
        const data = await response.json()
        setProduct(data)
        console.log('Data produk:', data)

        const sellerResponse = await fetch(
          `http://localhost:5000/api/user/${data.users_id}`
        )
        if (!sellerResponse.ok) {
          throw new Error('Gagal mengambil data penjual')
        }
        const sellerData = await sellerResponse.json()
        setSeller(sellerData)
      } catch (error) {
        setError(error.message)
        console.error('Terjadi kesalahan:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  const whatsappLink = seller
        ? `https://wa.me/${seller.no_wa}?text=Halo%20${seller.name},%20saya%20tertarik%20dengan%20produk%20Anda%20${product.product_name}`
        : '#';

  return (
    <div className="flex flex-col h-sceen">
      <Navbar />
      <div className=" bg-gray-100 py-16 px-16">
        <div className='text-md font-semibold'>Product Detail</div>
        <div className="max-w-6xl mx-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-600 text-sm">
              Sedang memuat data produk...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-sm">
              Terjadi kesalahan: {error}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-start lg:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-80 h-80 object-cover rounded-lg shadow-lg"
                />
                <div className="flex justify-between mt-4 text-sm font-semibold text-gray-700">
                  <div>Rp. {product.price}</div>
                  <div>Stock: {product.stock}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <h1 className="text-lg font-bold text-gray-900">
                  Novel: {product.product_name}
                </h1>
                <Link
                  to={`/seller-profile?id=${seller.user_id}`}
                  className="flex items-center space-x-3"
                >
                  <div className="font-semibold text-green-800 italic border border-green-800 rounded-md p-2 hover:text-white hover:bg-green-800">
                    {seller.name}
                  </div>
                </Link>
                <p className="text-gray-700">{product.description}</p>

                {/* Kategori Produk */}
                <div className="flex space-x-2">
                  {(product.categories || []).map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-600 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center px-6 py-3 text-white font-semibold bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
