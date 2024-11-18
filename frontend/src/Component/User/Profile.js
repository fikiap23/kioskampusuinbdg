import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar'
import { useUser } from '../../UserContext'
import { PiUserCircle } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import CardMyProduct from '../Product/CardMyProduct'

const Profile = () => {
  const [products, setProducts] = useState()
  const { user, setUser } = useUser()
  const user_id = user.user_id
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${user_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem('currentUser')
      setUser(null)
      navigate('/')
    }
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus akun Anda?");
    if (confirmDelete) {
      fetch(`http://localhost:5000/api/user/${user_id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete user')
          }
          return response.text()
        })
        .then((message) => {
          console.log(message)
          alert('Akun berhasil dihapus!')
          navigate('/')
        })
        .catch((error) => {
          console.error('Error in handleDelete:', error)
          alert('Gagal menghapus akun')
        })
    }
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <Navbar />
      <div className="px-16 py-8">
        <div>
          <div className='font-semibold text-md mb-2'>Your Profile</div>
          <div className="flex w-full justify-evenly border border-spacing-1 border-slate-400 rounded-xl">
            <div className="flex flex-col items-center">
              <PiUserCircle className="text-9xl text-gray-800 mb-5" />
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-950 text-[#FFFFFF] text-sm rounded-xl font-normal px-4 py-2 text-center border border-spacing-4 mb-5"
              >
                Logout
              </button>
              <button
                className="bg-red-400 hover:bg-red-600 text-[#FFFFFF] text-sm rounded-xl font-normal px-4 py-2 text-center border border-spacing-4 mb-5"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>

            <div className='flex flex-col justify-center items-start gap-4'>
              <div>
                <div className='text-xs font-light italic'>Full Name</div>
                <div className='text-lg'>{user.name}</div>
              </div>

              <div>
                <div className='text-xs font-light italic'>Email</div>
                <div className='text-lg'>{user.email}</div>
              </div>

              <div>
                <div className='text-xs font-light italic'>WhatsApp Number</div>
                <div className='text-lg'>{user.no_wa}</div>
              </div>

              <Link to={'/edit-profile'}>
                <button className="flex justify-center w-full bg-green-700 hover:bg-green-900 text-[#FFFFFF] text-sm rounded-xl px-4 py-2 text-center">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      

      <div className="px-16 py-8">
        <div className='text-md font-semibold mb-2'>My Product</div>
        <div className="border border-slate-400 rounded-xl text-left">
          {products ? (
            products.map((product) => (
              <CardMyProduct key={product.id} data={product} />
            ))
          ) : (
            <div>No Product Available</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile