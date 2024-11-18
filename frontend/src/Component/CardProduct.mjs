import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CardProduct = ({ data }) => {
  return (
      <div className="z-0 relative flex flex-col bg-white drop-shadow-xl w-48 h-84 my-4 rounded-lg">
        <img
          src={data.image}
          className="h-48 w-48 p-1 rounded-lg object-cover"
          alt="Product"
        />
        <div className="h-4 text-left font-semibold px-2 py-1 my-1 text-xs">
          {data.product_name}
        </div>
        <div className="">
          <div className="inline-block px-2 text-xs bg-[#EAECEB] rounded-lg border-2 border-[#EAECEB] -mb-14 ml-1">
            {data.category}
          </div>
          <div className="px-2 text-xs ml-1">{data.stock}</div>
          <div className="px-2 text-xs ml-1">Rp.{data.price}</div>
        </div>
        <div className='flex justify-center'>
          <Link to={`/product-detail?id=${data.product_id}`}>
            <button className="my-2 mx-3 py-1 hover:bg-green-100 w-40 text-center text-xs bg-green-200 rounded-lg">
              See Details
            </button>
          </Link>
        </div>
      
      </div>
  )
}

export default CardProduct
