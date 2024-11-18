import pkg from 'pg';
const { Pool } = pkg;
import { Sequelize } from "sequelize";

const pool = new Pool({
    user: "kioskampus_owner",
    password: "kfYzmsMX1e7V",
    host: "ep-hidden-fog-a17o0vk1.ap-southeast-1.aws.neon.tech",
    port: 5432,
    database: "kioskampus_db",
    ssl: {
        rejectUnauthorized: false
    }
});

const sequelize = new Sequelize('kioskampus_db', 'kioskampus_owner', 'kfYzmsMX1e7V', {
    host: "ep-hidden-fog-a17o0vk1.ap-southeast-1.aws.neon.tech",
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Tambahkan ini jika Anda tidak memerlukan sertifikat SSL yang diverifikasi
        }
    }
});




const db = {
    query: (text, params) => pool.query(text, params)
};

export { db, sequelize };
