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
	
	// Nueva función para las preguntas predefinidas
    const handlePreguntas = async (req, res) => {
        const { id } = req.params; // Recibimos el número de pregunta (1, 2, 3, 4)
        let query = "";

        // Asignamos la SQL según la opción elegida
        switch (id) {
            case '1': // Km de traza
                query = `SELECT ROUND((SUM(ST_Length(ST_Intersection(r.geom, p.geom)::geography)) / 1000)::numeric, 2) as valor FROM "Red_Vial" r, "Provincias" p WHERE p.provincia ILIKE '%Chaco%' AND r.nro_ruta = '11' AND r.administra = 'Nacional';`;
                break;
            case '2': // Población 0-10km
                query = `SELECT COALESCE(SUM(canthab), 0) as valor FROM "Localidades" WHERE ST_DWithin(geom::geography, (SELECT ST_Union(ST_Intersection(r.geom, p.geom)) FROM "Red_Vial" r, "Provincias" p WHERE r.nro_ruta = '11' AND p.provincia ILIKE '%Chaco%'  AND r.administra = 'Nacional')::geography, 10000);`;
                break;
            case '3': // Población 10-20km
                query = `SELECT COALESCE(SUM(canthab), 0) as valor FROM "Localidades" WHERE ST_DWithin(geom::geography, (SELECT ST_Union(ST_Intersection(r.geom, p.geom)) FROM "Red_Vial" r, "Provincias" p WHERE r.nro_ruta = '11' AND p.provincia ILIKE '%Chaco%' AND r.administra = 'Nacional')::geography, 20000) AND NOT ST_DWithin(geom::geography, (SELECT ST_Union(ST_Intersection(r.geom, p.geom)) FROM "Red_Vial" r, "Provincias" p WHERE r.nro_ruta ='11' AND p.provincia ILIKE '%Chaco%' AND r.administra = 'Nacional')::geography, 10000);`;
                break;
            case '4': // Puentes
                query = `SELECT COUNT(*) as cantidad, STRING_AGG(pu.nombre, ', ') as detalle FROM "Puente_Red_Vial_Puntos" pu, "Red_Vial" r, "Provincias" p WHERE r.nro_ruta = '11' AND p.provincia ILIKE '%Chaco%' AND r.administra = 'Nacional' AND ST_Intersects(r.geom, p.geom) AND ST_DWithin(pu.geom::geography, r.geom::geography, 50);`;
                break;
            default:
                return res.status(400).json({ error: "Opción no válida" });
        }

        try {
            const result = await pool.query(query);
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Error en consulta SQL:", error);
            res.status(500).json({ error: "Error calculando datos." });
        }
    };

    return {
        handleConsulta,
        addFeature,
		handlePreguntas 
    };
};