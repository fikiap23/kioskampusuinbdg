import { Router } from "express";
import Product from "../models/products.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { productValidation } from "../middleware/validate.mjs";
import multer from 'multer';
import path from 'path';
import { Op } from 'sequelize';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data'


const router = new Router();

const imageAPIKey = "ce27330d1b0650de28d068b9e40df50a";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const imagePath = req.file.path;

        const imageData = fs.readFileSync(imagePath);
        const formData = new FormData();
        formData.append('image', imageData.toString('base64'));
    
        const response = await axios.post('https://api.imgbb.com/1/upload?key=' + imageAPIKey, formData, {
            headers: formData.getHeaders(),
        });

        const uploadedImageUrl = response.data.data.url;
        const correctUrl = uploadedImageUrl.replace('https://i.ibb.co/', 'https://i.ibb.co.com/');

        fs.unlinkSync(imagePath);

        res.status(200).json({
            message: 'File uploaded successfully',
            imageUrl: correctUrl, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading image');
    }
});


router.get("/api/products", async (req, res) => {
    try {
        const result = await Product.findAll();
        console.log("get products success");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



router.get("/api/products/:users_id", async (req, res) => {
    const users_id = req.params.users_id;
    try {
        const findProduct = await Product.findAll({ where: { users_id } });
        if (!findProduct) return res.sendStatus(404);
        return res.json(findProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get("/api/products/:category", async(req, res) => {
    const category = req.params.category;
    console.log(category)
    try {
        const findProducts = await Product.findAll({where: {category}})
        if(!findProducts) return res.sendStatus(404);
        return res.json(findProducts);
    } catch (error) {
        console.log(error);
        res.sendStatus(500).send("Internal Server Error")
    }
})

router.get("/api/product/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const findProduct = await Product.findByPk(id);
        if(!findProduct) return res.sendStatus(404);
        return res.json(findProduct)
    } catch(err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
})

router.get("/api/products/search/:keyword", async (req, res) => {
    const { keyword } = req.params;
    try {
        const products = await Product.findAll({
            where: {
                product_name: {
                    [Op.iLike]: `%${keyword}%`
                }
            }
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post(
    "/api/product",
    upload.single("image"),
    checkSchema(productValidation),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const imagePath = req.file.path;

        const data = matchedData(req);

        if (req.file) {
            data.image = req.file.path;
        }

        try {
            const imageData = fs.readFileSync(imagePath);
            const formData = new FormData();
            formData.append('image', imageData.toString('base64'));

            const response = await axios.post('https://api.imgbb.com/1/upload?key=' + imageAPIKey, formData, {
                headers: formData.getHeaders(),
            });

            // Jika upload sukses, hapus file yang diupload dari server
            fs.unlinkSync(imagePath);

            // Simpan URL gambar dari imgbb ke dalam data produk
            const uploadedImageUrl = response.data.data.url;
            const correctUrl = uploadedImageUrl.replace('https://i.ibb.co/', 'https://i.ibb.co.com/');
            data.image = correctUrl;


            const newProduct = await Product.create(data);
            res.status(201).json(newProduct);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.patch(
    "/api/product/:id",
    upload.single("image"),
    async (req, res) => {
        const product_id = req.params.id;
        const data = req.body;

        try {
            if (req.file) {
                // Jika ada file yang diunggah, proses upload ke ImgBB
                const imagePath = req.file.path;
                const imageData = fs.readFileSync(imagePath);
                const formData = new FormData();
                formData.append('image', imageData.toString('base64'));

                const response = await axios.post('https://api.imgbb.com/1/upload?key=' + imageAPIKey, formData, {
                    headers: formData.getHeaders(),
                });

                fs.unlinkSync(imagePath);

                const uploadedImageUrl = response.data.data.url;
                const correctUrl = uploadedImageUrl.replace('https://i.ibb.co/', 'https://i.ibb.co.com/');
                data.image = correctUrl;

            }

            const [updatedRows] = await Product.update(data, { where: { product_id } });

            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Product not found or no changes made' });
            }

            const updatedProduct = await Product.findOne({ where: { product_id } });
            res.status(200).json(updatedProduct);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
);



router.delete("/api/product/:id", async(req, res) => {
    const product_id = req.params.id;
    try {
        const deleteProduct = await Product.destroy({where: {product_id}})

        if(deleteProduct === 0) {
            console.log("Product not found")
        } else{
            console.log("Product deleted!")
            res.send("Product deleted!")
        }

    } catch (error) {
        console.log(error)
    }
})

export default router;
