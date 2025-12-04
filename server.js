import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import serveIndex from 'serve-index';
import { createConsultaController } from './controllers/consultaController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// 1. Middleware para JSON (Obligatorio para POST)
app.use(express.json());

// Configuración de Base de Datos
const dbConfig = {
	user: process.env.PGUSER || 'postgres',
	host: process.env.PGHOST || 'localhost',
	database: process.env.PGDATABASE || 'sigtpi',
	password: process.env.PGPASSWORD || 'toor',
	port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
};

const pool = new pg.Pool(dbConfig);
const consultaController = createConsultaController(pool);

// ==================================================================
// 2. RUTAS DE LA API (El cambio está aquí)
// ==================================================================
// Usamos el prefijo /api/ para evitar conflictos con archivos
app.get('/api/consulta', consultaController.handleConsulta);
app.post('/api/features', consultaController.addFeature); 
// NUEVA RUTA PARA LAS PREGUNTAS
app.get('/api/preguntas/:id', consultaController.handlePreguntas);
// NUEVA RUTA PARA LEER LA CAPA DE DIBUJO
app.get('/api/features', consultaController.getDibujos); 

// ==================================================================
// 3. ARCHIVOS ESTÁTICOS (Siempre al final)
// ==================================================================
const staticDir = path.join(__dirname, 'static');
app.use('/', express.static(staticDir));
app.use('/', serveIndex(staticDir, { icons: true }));

// Inicio del servidor
app.listen(port, () => {
	console.log(`------------------------------------------------`);
	console.log(`Servidor corriendo en http://localhost:${port}`);
	console.log(`API lista para recibir datos en: /api/features`);
	console.log(`------------------------------------------------`);
});