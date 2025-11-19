// controllers/consultaController.js
import pg from 'pg';

export const createConsultaController = (pool) => {

    const handleConsulta = async (req, res) => {
        const { layer, bbox } = req.query;
        try {
            // Lógica placeholder para consultas futuras
            res.status(200).json({ message: 'Consulta recibida', layer, bbox });
        } catch (error) {
            console.error('Error en handleConsulta:', error);
            res.status(500).json({ error: 'Error al realizar la consulta.' });
        }
    };

    // Función para añadir nuevas features POST
    const addFeature = async (req, res) => {
        // 'layer' viene del select en el HTML (value="capa_dibujo")
        const { layer, feature } = req.body; 
        
        if (!layer || !feature || !feature.geometry) {
            return res.status(400).json({ error: 'Datos de la feature incompletos.' });
        }

        // 1. VALIDACIÓN: Asegúrate de incluir aquí el nombre exacto de tu tabla en Postgres
        // Si en map.js el ID es 'capa_dibujo', aquí debe estar 'capa_dibujo'
        const validLayers = ['capa_dibujo', 'espejos_de_agua']; 
        
        if (!validLayers.includes(layer)) {
            return res.status(400).json({ error: `La capa '${layer}' no es válida o no está permitida para dibujar.` });
        }

        const geometry = JSON.stringify(feature.geometry);
        const properties = feature.properties || {};
        const featureName = properties.name || 'Sin Nombre';

        // Query de inserción
        // Asume que tu tabla tiene columnas: id, geom, nombre
        const query = `
            INSERT INTO ${layer} (geom, nombre)
            VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4326), $2)
            RETURNING *;
        `;
        
        try {
            const result = await pool.query(query, [geometry, featureName]);
            console.log("Feature guardada:", result.rows[0]); // Log para depuración
            res.status(201).json({ message: 'Feature agregada exitosamente.', newFeature: result.rows[0] });
        } catch (error) {
            console.error('Error al insertar la feature en la base de datos:', error);
            res.status(500).json({ error: 'Error en base de datos: ' + error.message });
        }
    };

    return {
        handleConsulta,
        addFeature
    };
};