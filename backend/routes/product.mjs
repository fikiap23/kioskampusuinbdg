import { Router } from 'express'
import Product from '../models/products.mjs'
import { checkSchema, matchedData, validationResult } from 'express-validator'
import { productValidation } from '../middleware/validate.mjs'
import multer from 'multer'
import { Op } from 'sequelize'
import axios from 'axios'
import FormData from 'form-data'

const router = new Router()

const imageAPIKey = 'ce27330d1b0650de28d068b9e40df50a'

const storage = multer.memoryStorage() // Menggunakan penyimpanan memori
const upload = multer({ storage: storage })

router.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }

  try {
    const formData = new FormData()
    formData.append('image', req.file.buffer.toString('base64')) // Menggunakan buffer langsung

    const response = await axios.post(
      'https://api.imgbb.com/1/upload?key=' + imageAPIKey,
      formData,
      {
        headers: formData.getHeaders(),
      }
    )

    const uploadedImageUrl = response.data.data.url
    const correctUrl = uploadedImageUrl.replace(
      'https://i.ibb.co/',
      'https://i.ibb.co.com/'
    )

    res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: correctUrl,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error uploading image')
  }
})

router.post(
  '/api/product',
  upload.single('image'),
  checkSchema(productValidation),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const data = matchedData(req)

    try {
      if (req.file) {
        const formData = new FormData()
        formData.append('image', req.file.buffer.toString('base64'))

        const response = await axios.post(
          'https://api.imgbb.com/1/upload?key=' + imageAPIKey,
          formData,
          {
            headers: formData.getHeaders(),
          }
        )

        const uploadedImageUrl = response.data.data.url
        const correctUrl = uploadedImageUrl.replace(
          'https://i.ibb.co/',
          'https://i.ibb.co.com/'
        )
        data.image = correctUrl
      }

      const newProduct = await Product.create(data)
      res.status(201).json(newProduct)
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    }
  }
)

router.patch('/api/product/:id', upload.single('image'), async (req, res) => {
  const product_id = req.params.id
  const data = req.body

  try {
    if (req.file) {
      const formData = new FormData()
      formData.append('image', req.file.buffer.toString('base64'))

      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=' + imageAPIKey,
        formData,
        {
          headers: formData.getHeaders(),
        }
      )

      const uploadedImageUrl = response.data.data.url
      const correctUrl = uploadedImageUrl.replace(
        'https://i.ibb.co/',
        'https://i.ibb.co.com/'
      )
      data.image = correctUrl
    }

    const [updatedRows] = await Product.update(data, { where: { product_id } })

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Product not found or no changes made' })
    }

    const updatedProduct = await Product.findOne({ where: { product_id } })
    res.status(200).json(updatedProduct)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

router.delete('/api/product/:id', async (req, res) => {
  const product_id = req.params.id
  try {
    const deleteProduct = await Product.destroy({ where: { product_id } })

    if (deleteProduct === 0) {
      return res.status(404).send('Product not found')
    } else {
      res.send('Product deleted!')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
