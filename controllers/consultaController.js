/**
 * Fábrica de controller para el endpoint de consulta.
 *
 * Expone un único handler que acepta una geometría en WKT (vía `wkt`)
 * o una geometría en GeoJSON (vía `geojson`) y consulta en PostGIS la tabla
 * `red_vial` por aquellos registros que intersectan la geometría provista.
 *
 * El formato de respuesta se selecciona con el parámetro `format`:
 * - format=html → tabla HTML simple (excluye la columna geom)
 * - format=json → GeoJSON FeatureCollection (geometry con ST_AsGeoJSON, properties sin geom)
 *
 *
 * @param {import('pg').Pool} pool - Pool de pg para conexiones a la BD
 * @returns {{ handleConsulta: import('express').RequestHandler }}
 */
// controllers/consultaController.js
import pg from 'pg';

export const createConsultaController = (pool) => {

    // Función para manejar consultas GET (ej. a tu DB directa) - Mantenida por si acaso
    const handleConsulta = async (req, res) => {
        // Ejemplo de consulta a la base de datos
        const { layer, bbox } = req.query; // Puedes recibir parámetros para filtrar
        try {
            // Aquí puedes construir tu lógica para consultar datos en la DB
            // Por ejemplo, para obtener features de una capa específica dentro de un bbox
            // Esto es más complejo y depende de cómo estén tus tablas.
            // Para GeoJSON locales y WMS, la consulta se hace principalmente en el cliente.
            res.status(200).json({ message: 'Consulta recibida, implementa tu lógica aquí.', layer, bbox });
        } catch (error) {
            console.error('Error en handleConsulta:', error);
            res.status(500).json({ error: 'Error al realizar la consulta.' });
        }
    };

    // Función para añadir nuevas features POST
    const addFeature = async (req, res) => {
        const { layer, feature } = req.body; // 'layer' es el ID de la capa, 'feature' es el GeoJSON
        
        if (!layer || !feature || !feature.geometry) {
            return res.status(400).json({ error: 'Datos de la feature incompletos.' });
        }

        // Validación básica del nombre de la capa
        // DEBES ASEGURARTE DE QUE 'layer' COINCIDA CON UNA TABLA VÁLIDA EN TU DB
        // Para este ejemplo, asumiremos que 'espejos_de_agua' es la tabla
        const validLayers = ['espejos_de_agua']; // Agrega aquí todas tus capas vectoriales donde se puede dibujar
        if (!validLayers.includes(layer)) {
            return res.status(400).json({ error: `La capa '${layer}' no es válida para dibujar.` });
        }

        const geometry = JSON.stringify(feature.geometry);
        const properties = feature.properties || {};
        const featureName = properties.name || 'Nueva Feature'; // Atributo 'name'

        // Asegúrate de que tu tabla 'espejos_de_agua' tenga una columna 'geom' de tipo GEOMETRY
        // y una columna 'nombre' de tipo TEXT (o similar)
        const query = `
            INSERT INTO ${layer} (geom, nombre)
            VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4326), $2)
            RETURNING *;
        `;
        
        try {
            const result = await pool.query(query, [geometry, featureName]);
            res.status(201).json({ message: 'Feature agregada exitosamente.', newFeature: result.rows[0] });
        } catch (error) {
            console.error('Error al insertar la feature en la base de datos:', error);
            res.status(500).json({ error: 'Error al agregar la feature a la base de datos.' });
        }
    };

    return {
        handleConsulta,
        addFeature
    };
};