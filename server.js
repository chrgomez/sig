// App Express principal y dependencias
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import serveIndex from 'serve-index';
import { createConsultaController } from './controllers/consultaController.js';

dotenv.config();

// para obtener el nombre del archivo y el directorio actual
// y poder usarlo para servir los archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Configuración de conexión a BD (se puede sobrescribir por variables de entorno)
const dbConfig = {
	user: process.env.PGUSER || 'postgres',
	host: process.env.PGHOST || 'localhost',
	database: process.env.PGDATABASE || 'sigtpi',
	password: process.env.PGPASSWORD || 'toor',
	port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
};

// Pool de conexiones a Postgres
const pool = new pg.Pool(dbConfig);

// Middleware estático y listado de directorios para la carpeta /static
const staticDir = path.join(__dirname, 'static');
app.use('/', express.static(staticDir));
app.use('/', serveIndex(staticDir, { icons: true }));

// Registro de rutas en un solo lugar (controller contiene solo la lógica)
const consultaController = createConsultaController(pool);
app.get('/consulta', consultaController.handleConsulta);

// Inicio del servidor HTTP
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
	console.log(`Serving static from ${staticDir}`);
});
