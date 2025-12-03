// static/map.js
import { URL_OGC } from './url.js';

// =========================================================================
// CONFIGURACIÓN DE CAPAS
// =========================================================================
const layersConfig = [
	{ id: 'actividades_agropecuarias', title: 'Actividades Agropecuarias', workspaceLayer: 'Actividades_Agropecuarias', visible: false },
	{ id: 'actividades_economicas', title: 'Actividades Economicas', workspaceLayer: 'Actividades_Economicas', visible: false },
	{ id: 'complejo_de_energia_ene', title: 'Complejo de Energia', workspaceLayer: 'Complejo_de_Energia_Ene', visible: false },
	{ id: 'curso_de_agua_hid', title: 'Curso de Agua', workspaceLayer: 'Curso_de_Agua_Hid', visible: false },
	{ id: 'curvas_de_nivel', title: 'Curvas de Nivel', workspaceLayer: 'Curvas_de_Nivel', visible: false },
	{ id: 'edif_turisticos', title: 'Edificios de Turisticos', workspaceLayer: 'Edif_Construcciones_Turisticas', visible: false },
	{ id: 'edif_deportes', title: 'Edificios de Deportes', workspaceLayer: '	Edif_Depor_y_Esparcimiento', visible: false },
	{ id: 'edif_educacion', title: 'Edificios de Educación', workspaceLayer: 'Edif_Educacion', visible: false },
	{ id: 'edif_religiosos', title: 'Edificios de Religiosos', workspaceLayer: 'Edif_Religiosos', visible: false },
	{ id: 'edif_publicos', title: 'Edificios de Publicos', workspaceLayer: 'Edificio_Publico_IPS', visible: false },
	{ id: 'edif_salud', title: 'Edificios de Salud', workspaceLayer: 'Edificio_de_Salud_IPS', visible: false },
	{ id: 'edif_seguridad', title: 'Edificios de Seguridad', workspaceLayer: 'Edificio_de_Seguridad_IPS', visible: false },
	{ id: 'edif_ferroviarios', title: 'Edificios de Ferroviarios', workspaceLayer: 'Edificios_Ferroviarios', visible: false },
	{ id: 'ejido', title: 'Ejido', workspaceLayer: 'Ejido', visible: false },
    { id: 'espejo_de_agua_hid', title: 'Espejo de Agua', workspaceLayer: 'Espejo_de_Agua_Hid', visible: false },
	{ id: 'estructuras_portuarias', title: 'Estructuras Portuarias', workspaceLayer: 'Estructuras_portuarias', visible: false },
	{ id: 'infra_agro', title: 'Infraestructura Aeroportuaria', workspaceLayer: 'Infraestructura_Aeroportuaria_Punto', visible: false },
	{ id: 'infra_hidro', title: 'Infraestructura Hidro', workspaceLayer: 'Infraestructura_Hidro', visible: false },
	{ id: 'isla', title: 'Isla', workspaceLayer: 'Isla', visible: false },
	{ id: 'limite_politico', title: 'Limite Politico Administrativo', workspaceLayer: 'Limite_Politico_Administrativo_Lim', visible: false },
	{ id: 'localidades', title: 'Localidades', workspaceLayer: 'Localidades', visible: false },
	{ id: 'lineas_conduccion', title: 'Líneas de Conducción', workspaceLayer: 'Líneas_de_Conducción_Ene', visible: false },
	{ id: 'marcas_senales', title: 'Marcas y Señales', workspaceLayer: 'Marcas_y_Señales', visible: false },
	{ id: 'muro_embalse', title: 'Muro Embalse', workspaceLayer: 'Muro_Embalse', visible: false },
	{ id: 'obra_portuaria', title: 'Obra Portuaria', workspaceLayer: 'Obra_Portuaria', visible: false },
	{ id: 'obra_comunicacion', title: 'Obra de Comunicación', workspaceLayer: 'Obra_de_Comunicación', visible: false },
	{ id: 'otras_edificaciones', title: 'Otras Edificaciones', workspaceLayer: '	Otras_Edificaciones', visible: false },
	{ id: 'pais_lim', title: 'Pais Lim', workspaceLayer: 'Pais_Lim', visible: false },
	{ id: 'provincias', title: 'Provincias', workspaceLayer: 'Provincias', visible: false },
	{ id: 'puente_red_vial', title: 'Puente Red Vial Puntos', workspaceLayer: 'Puente_Red_Vial_Puntos', visible: false },
	{ id: 'puntos_alturas_topo', title: 'Puntos Altura Topograficas', workspaceLayer: 'Puntos_de_Alturas_Topograficas', visible: false },
	{ id: 'puntos_terreno', title: 'Puntos del Terreno', workspaceLayer: 'Puntos_del_Terreno', visible: false },
	{ id: 'red_vial', title: 'Red Vial', workspaceLayer: 'Red_Vial', visible: false },
	{ id: 'red_ferroviaria', title: 'Red Ferroviaria', workspaceLayer: 'Red_ferroviaria', visible: false },
	{ id: 'salvado_de_obstaculo', title: 'Salvado de Obstaculo', workspaceLayer: 'Salvado_de_Obstaculo', visible: false },
	{ id: 'senalizaciones', title: 'Señalizaciones', workspaceLayer: 'Señalizaciones', visible: false },
	{ id: 'sue_costero', title: 'Sue Costero', workspaceLayer: 'Sue_Costero', visible: false },
	{ id: 'sue_hidromorfologico', title: 'Sue Hidromorfologico', workspaceLayer: 'Sue_Hidromorfologico', visible: false },
	{ id: 'sue_no_consolidado', title: 'Sue No Consolidado', workspaceLayer: 'Sue_No_Consolidado', visible: false },
	{ id: 'sue_congelado', title: 'Sue Congelado', workspaceLayer: 'Sue_congelado', visible: false },
	{ id: 'sue_consolidado', title: 'Sue Consolidado', workspaceLayer: 'Sue_consolidado', visible: false },
	{ id: 'veg_arborea', title: 'Veg Arborea', workspaceLayer: 'Veg_Arborea', visible: false },
	{ id: 'veg_arbustiva', title: 'Veg Arbustiva', workspaceLayer: 'Veg_Arbustiva', visible: false },
	{ id: 'veg_cultivos', title: 'Veg Cultivos', workspaceLayer: 'Veg_Cultivos', visible: false },
	{ id: 'veg_suelo_desnudo', title: 'Veg Suelo Desnudo', workspaceLayer: 'Veg_Suelo_Desnudo', visible: false },
	{ id: 'vias_secundarias', title: 'Vias Secundarias', workspaceLayer: 'Vias_Secundarias', visible: false },
	{ id: 'veg_hidrofila', title: 'Veg Hidrofila', workspaceLayer: 'veg_Hidrofila', visible: false },
	
    
    
    // IMPORTANTE: Agregamos esta capa VECTORIAL para que funcione la herramienta de DIBUJO.
    // Si tienes una capa real en BD, cambia 'url' por tu endpoint WFS o GeoJSON local.
    // Aquí la dejo vacía inicialmente para que puedas dibujar sobre ella.
    { 
        id: 'capa_dibujo', 
        title: 'Capa de Dibujo (Vector)', 
        visible: true, 
        isVector: true, 
        url: null // null = capa vacía en memoria para empezar
    }
];

const wmsLayers = [];
const vectorLayers = {}; 

// Capa base del IGN
const baseLayer = new ol.layer.Tile({
    title: "Base Map IGN",
    source: new ol.source.TileWMS({
        url: 'https://wms.ign.gob.ar/geoserver/ows',
        params: { 'LAYERS': 'ign:provincia', 'VERSION': '1.3.0' },
        serverType: 'geoserver'
    })
});

// Crear las capas
layersConfig.forEach(config => {
    if (config.isVector) {
        // Lógica para capa vectorial
        const vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON()
        });
        
        // Si tiene URL, cargamos los datos (ej. archivo local o WFS)
        if (config.url) {
            vectorSource.setUrl(config.url);
        }

        const vectorLayer = new ol.layer.Vector({
            title: config.title,
            id: config.id,
            source: vectorSource,
            visible: config.visible,
            style: new ol.style.Style({
                fill: new ol.style.Fill({ color: 'rgba(255, 204, 51, 0.4)' }),
                stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({ color: '#ffcc33' }),
                    stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
                })
            })
        });
        wmsLayers.push(vectorLayer);
        vectorLayers[config.id] = vectorLayer;
    } else {
        // Lógica para capa WMS
        const layer = new ol.layer.Image({
            title: config.title,
            id: config.id,
            visible: config.visible,
            source: new ol.source.ImageWMS({
                url: URL_OGC,
                params: { 'LAYERS': config.workspaceLayer },
                serverType: 'geoserver'
            })
        });
        wmsLayers.push(layer);
    }
});

// =========================================================================
// INICIALIZACIÓN DEL MAPA
// =========================================================================
const map = new ol.Map({
    target: 'map',
    // Agregamos ScaleLine para tener la barra de escala visual (funcionalidad requerida)
    controls: ol.control.defaults.defaults().extend([
        new ol.control.ScaleLine({ units: 'metric' }) 
    ]),
    layers: [baseLayer, ...wmsLayers],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [-59, -27.5],
        zoom: 4
    })
});

// Referencias al DOM
const layersControl = document.getElementById('layers-control');
const mapInteractions = document.getElementById('map-interactions');
const selectedFeaturesInfo = document.getElementById('selected-features-info');
const measurementOutput = document.getElementById('measurement-output');
const scaleInfo = document.getElementById('scale-info');
const legendPanel = document.getElementById('legend-panel');
const drawingAttributesDiv = document.getElementById('drawing-attributes');
const drawLayerSelect = document.getElementById('draw-layer-select');
const featureNameInput = document.getElementById('feature-name');
const saveFeatureBtn = document.getElementById('save-feature-btn');
const cancelDrawBtn = document.getElementById('cancel-draw-btn');

// =========================================================================
// GESTIÓN DE CAPAS (Checkboxes y Leyenda)
// =========================================================================
wmsLayers.forEach(layer => {
    const checkbox = document.querySelector(`#check_layer_${layer.get('id')}`);
    if (checkbox) {
        checkbox.checked = layer.getVisible();
        
        const changeHandler = () => {
            const isVisible = layer.getVisible();
            // Sincronizar checkbox
            if (checkbox.checked !== isVisible) checkbox.checked = isVisible;
            
            updateLegend();
            saveMapState();
        };

        checkbox.addEventListener('change', function () {
            layer.setVisible(this.checked);
            if (layer.getSource() && typeof layer.getSource().refresh === 'function') {
                layer.getSource().refresh();
            }
            changeHandler();
        });

        layer.on('change:visible', changeHandler);
    }
});

// =========================================================================
// FUNCIÓN updateLegend CORREGIDA
// =========================================================================
function updateLegend() {
    legendPanel.innerHTML = ''; 
    
    wmsLayers.forEach(layer => {
        // 1. Si la capa no es visible, no mostramos leyenda
        if (!layer.getVisible()) return;

        // 2. CAMBIO: Si es la capa de dibujo, LA IGNORAMOS (no mostramos nada)
        if (layer.get('id') === 'capa_dibujo') return;

        const title = layer.get('title');
        const source = layer.getSource();
        const legendItem = document.createElement('div');
        legendItem.style.marginBottom = '15px';

        // 3. CAMBIO: Generación robusta de la URL para evitar el error "No service"
        if (source instanceof ol.source.ImageWMS || source instanceof ol.source.TileWMS) {
            
            // Obtenemos la URL base (ej: http://localhost:9090/geoserver/ows)
            let baseUrl = source.getUrl();
            if (Array.isArray(baseUrl)) baseUrl = baseUrl[0]; // Por si devuelve un array

            // TRUCO: Reemplazamos '/ows' por '/wms' para ir directo al servicio de mapas
            // Esto soluciona el error <ows:ExceptionText>No service: ( ows )
            baseUrl = baseUrl.replace(/\/ows\/?$/, '/wms');

            // Limpiamos parámetros previos
            baseUrl = baseUrl.split('?')[0];

            const layerName = source.getParams().LAYERS;

            // Construimos la URL con todos los parámetros obligatorios
            const legendUrl = `${baseUrl}?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}&LEGEND_OPTIONS=forceLabels:on`;

            legendItem.innerHTML = `
                <div style="font-weight:bold; margin-bottom:5px; color:#333;">${title}</div>
                <img src="${legendUrl}" alt="Leyenda de ${title}" style="border:1px solid #ccc; padding:2px; background:white;">
            `;
        } else {
            // Para otras capas vectoriales (si tuvieras alguna local que no sea dibujo)
            legendItem.innerHTML = `<strong>${title}</strong><br><span>(Vector Local)</span>`;
        }
        
        legendPanel.appendChild(legendItem);
    });
}

// Escala numérica (texto)
map.on('moveend', function () {
    const view = map.getView();
    const resolution = view.getResolution();
    const projection = view.getProjection();
    const center = view.getCenter();

    let scale;
    if (projection.getUnits() === 'degrees') {
        const pointResolution = ol.proj.getPointResolution(projection, resolution, center, 'm');
        const dpi = 25.4 / 0.28;
        const inchesPerMeter = 39.37;
        scale = Math.round(pointResolution * inchesPerMeter * dpi);
    } else {
        const units = projection.getUnits();
        const mpu = ol.proj.METERS_PER_UNIT[units];
        const dpi = 25.4 / 0.28;
        scale = Math.round(resolution * mpu * 39.37 * dpi);
    }
    scaleInfo.innerHTML = `Escala Aprox: 1:${scale.toLocaleString()}`;
    saveMapState();
});

// =========================================================================
// PERSISTENCIA (LocalStorage)
// =========================================================================
function saveMapState() {
    const view = map.getView();
    const visibleLayers = wmsLayers.filter(l => l.getVisible()).map(l => l.get('id'));
    localStorage.setItem('mapState', JSON.stringify({
        center: view.getCenter(),
        zoom: view.getZoom(),
        visibleLayers: visibleLayers
    }));
}

function loadMapState() {
    const savedState = localStorage.getItem('mapState');
    if (savedState) {
        const state = JSON.parse(savedState);
        if (state.center && state.zoom) {
            map.getView().setCenter(state.center);
            map.getView().setZoom(state.zoom);
        }
        if (state.visibleLayers) {
            wmsLayers.forEach(l => {
                const shouldBeVisible = state.visibleLayers.includes(l.get('id'));
                l.setVisible(shouldBeVisible);
                // Forzar actualización del checkbox visualmente
                const cb = document.querySelector(`#check_layer_${l.get('id')}`);
                if(cb) cb.checked = shouldBeVisible;
            });
            updateLegend();
        }
    }
}

// =========================================================================
// GESTIÓN CENTRALIZADA DE INTERACCIONES
// =========================================================================
let currentInteraction = null;

// Capa para resaltar resultados de consulta
const highlightSource = new ol.source.Vector();
const highlightLayer = new ol.layer.Vector({
    source: highlightSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#00FFFF', width: 3 }), // Cyan brillante
        fill: new ol.style.Fill({ color: 'rgba(0, 255, 255, 0.3)' }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#00FFFF' })
        })
    }),
    zIndex: 999 // Siempre encima
});
map.addLayer(highlightLayer);

// Capa para dibujar mediciones
const measureSource = new ol.source.Vector();
const measureLayer = new ol.layer.Vector({
    source: measureSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
        stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#ffcc33' })
        })
    })
});
map.addLayer(measureLayer);

// Función principal para cambiar herramientas
function activateInteraction(type) {
    // 1. LIMPIEZA GENERAL
    if (currentInteraction) {
        map.removeInteraction(currentInteraction);
        currentInteraction = null;
    }
    
    // Limpiar capas auxiliares
    highlightSource.clear();
    measureSource.clear();
    selectedFeaturesInfo.innerHTML = '&nbsp;';
    measurementOutput.innerHTML = '&nbsp;';
    
    // Limpiar tooltips de medición
    document.querySelectorAll('.ol-tooltip').forEach(el => el.remove());
    map.un('pointermove', pointerMoveHandler);
    
    // Limpiar capas temporales de dibujo si existen
    map.getLayers().getArray().slice().forEach(layer => {
        if (layer.get('isDrawLayer')) map.removeLayer(layer);
    });

    // 2. ACTIVACIÓN SEGÚN TIPO
    if (type === 'consulta_punto') {
        currentInteraction = new ol.interaction.Pointer({
            handleDownEvent: () => true,
            handleUpEvent: (evt) => {
                performGetFeatureInfo(evt.coordinate, 'POINT');
                return true;
            }
        });
        map.addInteraction(currentInteraction);

    } else if (type === 'consulta_rectangulo') {
        currentInteraction = new ol.interaction.DragBox({
            condition: ol.events.condition.noModifierKeys
        });
        currentInteraction.on('boxend', () => {
            const extent = currentInteraction.getGeometry().getExtent();
            performGetFeatureInfo(extent, 'BBOX');
        });
        map.addInteraction(currentInteraction);

    } else if (type === 'medicion_distancia') {
        setupMeasureInteraction(); // Llamamos a la función de configuración

    } else if (type && type.startsWith('dibujo_')) {
        setupDrawInteraction(type.replace('dibujo_', '')); // 'punto', 'linea', etc.
    
    } else if (type === 'navegacion') {
        // Nada extra, solo limpieza
    }
}

// Event Listener para los radio buttons
mapInteractions.addEventListener('change', function (event) {
    if (event.target.name === 'controles') {
        const val = event.target.value;
        // Mostrar panel de atributos solo si es dibujo
        drawingAttributesDiv.style.display = val.startsWith('dibujo_') ? 'block' : 'none';
        activateInteraction(val);
    }
});

// =========================================================================
// LÓGICA DE CONSULTA MEJORADA (WMS para Punto / WFS para Rectángulo)
// =========================================================================

// Referencias al Modal
const modal = document.getElementById("featureModal");
const modalBody = document.getElementById("modalBody");
const closeModalSpan = document.getElementsByClassName("close-modal")[0];

// Cerrar modal al hacer click en la X
if (closeModalSpan) {
    closeModalSpan.onclick = function() {
        modal.style.display = "none";
    }
}
// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function performGetFeatureInfo(geometry, type) {
    // Feedback visual inmediato
    selectedFeaturesInfo.innerHTML = '<b>Consultando... por favor espere.</b>';
    highlightSource.clear();

    const view = map.getView();
    const visibleLayers = wmsLayers.filter(l => l.getVisible());

    if (visibleLayers.length === 0) {
        selectedFeaturesInfo.innerHTML = 'No hay capas visibles para consultar.';
        return;
    }

    let fetches = [];

    // ---------------------------------------------------------
    // CASO 1: CONSULTA POR PUNTO (Click) -> Usamos WMS GetFeatureInfo
    // ---------------------------------------------------------
    if (type === 'POINT') {
        const wmsLayersOnly = visibleLayers.filter(l => l.getSource() instanceof ol.source.ImageWMS || l.getSource() instanceof ol.source.TileWMS);
        
        fetches = wmsLayersOnly.map(layer => {
            const source = layer.getSource();
            const url = source.getFeatureInfoUrl(
                geometry, view.getResolution(), view.getProjection(), 
                { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': source.getParams().LAYERS }
            );
            if (url) {
                return fetch(url)
                    .then(res => res.json())
                    .then(data => ({ title: layer.get('title'), features: data.features }))
                    .catch(err => ({ title: layer.get('title'), error: err }));
            }
            return Promise.resolve(null);
        });
    } 
    
    // ---------------------------------------------------------
    // CASO 2: CONSULTA POR RECTÁNGULO (Box) -> Usamos WFS GetFeature
    // ---------------------------------------------------------
    else if (type === 'BBOX') {
        // Convertimos la geometría (extent) a bbox string: minx,miny,maxx,maxy
        // Importante: GeoServer WFS espera el orden de ejes correcto según la versión.
        // Para simplificar, usaremos la proyección de la vista (EPSG:4326 en tu caso).
        const extent = geometry; // geometry ya es un array [minx, miny, maxx, maxy]
        const bboxStr = extent.join(',');

        fetches = visibleLayers.map(layer => {
            // Obtenemos el nombre técnico de la capa (ej: 'sigtpi:Red_Vial')
            // Asumimos que 'config.workspaceLayer' se usó para crear el source.
            // Si es ImageWMS, podemos sacar el LAYERS de los params.
            let layerName = '';
            if (layer.getSource().getParams) {
                layerName = layer.getSource().getParams().LAYERS;
            } else {
                // Si es vectorial local, quizás no soporte WFS remoto. Lo saltamos.
                return Promise.resolve({ title: layer.get('title'), features: [] });
            }

            // Construimos la URL WFS manualmente
            // Usamos URL_OGC que es http://localhost:9090/geoserver/ows
            // outputFormat=application/json es clave para recibir GeoJSON
            const wfsUrl = `${URL_OGC}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json&bbox=${bboxStr}`;

            return fetch(wfsUrl)
                .then(res => res.json())
                .then(data => ({ title: layer.get('title'), features: data.features }))
                .catch(err => {
                    console.error("Error WFS", err);
                    return { title: layer.get('title'), error: err };
                });
        });
    }

    // ---------------------------------------------------------
    // PROCESAR RESULTADOS Y MOSTRAR EN MODAL
    // ---------------------------------------------------------
    Promise.all(fetches).then(results => {
        let foundCount = 0;
        
        // Variables para construir el HTML de Tabs
        let navHtml = '<div class="tabs-nav">';
        let contentHtml = '';
        let activeClass = 'active'; // Para marcar el primero como activo

        // Filtramos resultados vacíos primero para manejar índices correctamente
        const validResults = results.filter(res => res && res.features && res.features.length > 0);

        validResults.forEach((res, index) => {
            foundCount += res.features.length;
            const tabId = `tab-${index}`;
            
            // Lógica para saber si es el primero (activo) o el resto (inactivo)
            const isActive = index === 0;
            const activeClass = isActive ? 'active' : '';
            const displayStyle = isActive ? 'block' : 'none'; // <--- ESTO ES LO NUEVO E IMPORTANTE

            // 1. Crear Botón
            navHtml += `<button class="tab-btn ${activeClass}" onclick="switchTab('${tabId}')">${res.title} (${res.features.length})</button>`;

            // 2. Crear Contenido
            // Agregamos style="display: ${displayStyle}" para forzar la visibilidad desde el inicio
            contentHtml += `<div id="${tabId}" class="tab-content ${activeClass}" style="display: ${displayStyle};">`;
            
            // --- Tabla ---
            contentHtml += `<div class="table-responsive" style="max-height: 60vh;">`; 
            contentHtml += `<table class="result-table">`;

            const firstProps = res.features[0].properties;
            // LISTA DE COLUMNAS A IGNORAR (Campos técnicos, metadatos y códigos internos)
            const ignoredKeys = [
                // Geometría e IDs
                'bbox', 'the_geom', 'geom', 'gid', 'id', 'objectid', 
                
                // --- BASURA CAD (Lo que viste en la imagen) ---
                'igds_style', 'igds_type', 'igds_weigh', 'igds_weight', 
                'igds_color', 'igds_level', 'rotation', 'group', 'cell_name',
                'signo', 'entidad',
                
                // Metadatos administrativos irrelevantes
                'fuente', 'operador', 'dataset', 'responsabl', 'cargo', 
                'progreso', 't_act', 'actualizac', 'ac', 'administra',
                
                // Datos de proyección técnica
                'coord', 'coord_sp', 'sp', 'datum',
                
                // Códigos numéricos redundantes
                'fclass', 'coddepto', 'codloc', 'link'
            ];  
            const headers = Object.keys(firstProps).filter(k => !ignoredKeys.includes(k.toLowerCase()));

            contentHtml += `<thead><tr>`;
            headers.forEach(h => {
                contentHtml += `<th>${h.replace(/_/g, ' ').toUpperCase()}</th>`;
            });
            contentHtml += `</tr></thead>`;

            contentHtml += `<tbody>`;
            res.features.forEach(feat => {
                contentHtml += `<tr>`;
                headers.forEach(h => {
                    let val = feat.properties[h];
                    if (val === null || val === 'null' || val === undefined) val = '-';
                    contentHtml += `<td>${val}</td>`;
                });
                contentHtml += `</tr>`;
                
                // Highlight logic (resumido)
                try {
                     if (feat.geometry) {
                        const reader = new ol.format.GeoJSON();
                        const olFeature = reader.readFeature(feat, { featureProjection: view.getProjection(), dataProjection: view.getProjection() });
                        highlightSource.addFeature(olFeature);
                     }
                } catch(e) {}
            });
            contentHtml += `</tbody></table></div>`;
            contentHtml += `</div>`; // Fin div tab-content
        });

        navHtml += '</div>'; // Cerrar nav

        selectedFeaturesInfo.innerHTML = '&nbsp;';

        if (foundCount > 0) {
            // Inyectamos la estructura completa en el modal
            modalBody.innerHTML = `<div class="tabs-container">${navHtml}${contentHtml}</div>`;
            modal.style.display = "block";
        } else {
            alert("No se encontraron elementos.");
        }
    });
}


// =========================================================================
// LÓGICA DE MEDICIÓN
// =========================================================================
let sketch;
let measureTooltipElement;
let measureTooltip;

function setupMeasureInteraction() {
    // NO llamamos a activateInteraction(null) aquí, eso ya se hizo antes
    
    createMeasureTooltip();

    currentInteraction = new ol.interaction.Draw({
        source: measureSource,
        type: 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
            stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.5)', lineDash: [10, 10], width: 2 }),
            image: new ol.style.Circle({ radius: 5, fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }) })
        })
    });

    map.addInteraction(currentInteraction);

    currentInteraction.on('drawstart', function (evt) {
        sketch = evt.feature;
        sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            const output = formatLength(geom);
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(geom.getLastCoordinate());
        });
    });

    currentInteraction.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip(); // Preparar para la siguiente línea
    });

    map.on('pointermove', pointerMoveHandler);
}

function pointerMoveHandler(evt) {
    if (evt.dragging) return;
    if (sketch) measureTooltip.setPosition(evt.coordinate);
}

function createMeasureTooltip() {
    if (measureTooltipElement) measureTooltipElement.remove();
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(measureTooltip);
}

function formatLength(line) {
    const length = ol.sphere.getLength(line, { projection: map.getView().getProjection() });
    if (length > 100) return (Math.round(length / 1000 * 100) / 100) + ' km';
    return (Math.round(length * 100) / 100) + ' m';
}

// =========================================================================
// LÓGICA DE DIBUJO Y GUARDADO (Feature Creation)
// =========================================================================
let drawnFeature = null;

function setupDrawInteraction(typeStr) {
    // NO llamamos a activateInteraction(null)
    
    const typeMap = { 'punto': 'Point', 'linea': 'LineString', 'poligono': 'Polygon' };
    const geometryType = typeMap[typeStr] || 'Point';

    // Capa temporal visual mientras dibujamos
    const drawSource = new ol.source.Vector();
    const drawLayer = new ol.layer.Vector({
        source: drawSource,
        isDrawLayer: true,
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
            stroke: new ol.style.Stroke({ color: '#ff0000', width: 2 }),
            image: new ol.style.Circle({ radius: 7, fill: new ol.style.Fill({ color: '#ff0000' }) })
        })
    });
    map.addLayer(drawLayer);

    currentInteraction = new ol.interaction.Draw({
        source: drawSource,
        type: geometryType
    });

    map.addInteraction(currentInteraction);

    currentInteraction.on('drawend', function (evt) {
        drawnFeature = evt.feature;
        // Una vez dibujado, podemos querer detener el dibujo para guardar
        setTimeout(() => {
            alert("Geometría capturada. Ingresa el nombre y presiona 'Guardar Feature'.");
        }, 100);
    });
}

// Botón Guardar
saveFeatureBtn.onclick = async function () {
    if (!drawnFeature) return alert('Primero debes dibujar algo en el mapa.');
    
    const layerId = drawLayerSelect.value;
    const name = featureNameInput.value;
    if (!layerId) return alert('Selecciona una capa destino.');
    if (!name) return alert('Ingresa un nombre.');

    // Convertir a GeoJSON
    const format = new ol.format.GeoJSON();
    const geojson = format.writeFeatureObject(drawnFeature, {
        featureProjection: map.getView().getProjection(),
        dataProjection: 'EPSG:4326'
    });
    geojson.properties = { name: name };

    try {
        const res = await fetch('/api/features', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ layer: layerId, feature: geojson })
        });
        
        const data = await res.json();
        if (res.ok) {
            alert('Guardado OK: ' + data.message);
            
            // Si la capa destino está en el mapa, la refrescamos
            if (vectorLayers[layerId]) {
                vectorLayers[layerId].getSource().refresh();
            }
            
            // Volver a navegación
            document.getElementById('controles_navegacion').checked = true;
            activateInteraction('navegacion');
            featureNameInput.value = '';
            drawnFeature = null;
        } else {
            alert('Error: ' + data.error);
        }
    } catch (e) {
        console.error(e);
        alert('Error de conexión');
    }
};

// Botón Cancelar Dibujo
cancelDrawBtn.onclick = function() {
    document.getElementById('controles_navegacion').checked = true;
    activateInteraction('navegacion');
    featureNameInput.value = '';
    drawnFeature = null;
};

// =========================================================
// LÓGICA PARA EL MODAL DE CONSULTAS MINISTERIO
// =========================================================
const btnConsultas = document.getElementById('btnConsultasMinisterio');
const modalConsultas = document.getElementById('modalConsultas');
const closeConsultas = document.getElementById('closeModalConsultas');
const selectPregunta = document.getElementById('selectPregunta');
const divResultado = document.getElementById('resultadoConsulta');

// Abrir Modal
if(btnConsultas) {
    btnConsultas.onclick = function() {
        modalConsultas.style.display = "block";
    }
}

// Cerrar Modal
if(closeConsultas) {
    closeConsultas.onclick = function() {
        modalConsultas.style.display = "none";
        // Resetear formulario
        selectPregunta.value = "";
        divResultado.style.display = "none";
    }
}

// Lógica al seleccionar una pregunta
selectPregunta.addEventListener('change', async function() {
    const idPregunta = this.value;
    if(!idPregunta) return;

    // Mostrar "Cargando..."
    divResultado.style.display = "block";
    divResultado.innerHTML = '<div style="text-align:center; color:#666;">Calculando datos, por favor espere...</div>';

    try {
        const response = await fetch(`/api/preguntas/${idPregunta}`);
        const data = await response.json();

        if (response.ok) {
            let htmlRespuesta = "";
            
            // Formatear respuesta según la pregunta
            if (idPregunta === '1') {
                htmlRespuesta = `<h4 style="color:#0d6efd;">Longitud de Traza</h4>
                                 <p style="font-size:1.5em;">${data.valor} km</p>`;
            } else if (idPregunta === '2' || idPregunta === '3') {
                htmlRespuesta = `<h4 style="color:#0d6efd;">Población Afectada</h4>
                                 <p style="font-size:1.5em;">${data.valor} habitantes</p>`;
            } else if (idPregunta === '4') {
                htmlRespuesta = `<h4 style="color:#0d6efd;">Puentes en la traza</h4>
                                 <p><strong>Cantidad:</strong> ${data.cantidad}</p>
                                 <p><strong>Nombres:</strong> ${data.detalle || 'Sin nombres registrados'}</p>`;
            }

            divResultado.innerHTML = htmlRespuesta;
        } else {
            divResultado.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        }
    } catch (error) {
        divResultado.innerHTML = `<p style="color:red;">Error de conexión con el servidor.</p>`;
    }
});

// Cerrar si click afuera (para ambos modales)
window.onclick = function(event) {
    if (event.target == modalConsultas) {
        modalConsultas.style.display = "none";
    }
    // ... mantener lógica del otro modal si existe ...
}

// =========================================================================
// INICIO
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Llenar select de dibujo
    drawLayerSelect.innerHTML = '';
    for (const id in vectorLayers) {
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = vectorLayers[id].get('title');
        drawLayerSelect.appendChild(opt);
    }

    loadMapState();
    
    // Iniciar en navegación
    document.getElementById('controles_navegacion').click();
});

// =========================================================================
// =========================================================================
// UTILIDAD PARA CAMBIAR PESTAÑAS (CORREGIDA)
// =========================================================================
window.switchTab = function(tabId) {
    // 1. Ocultar TODOS los contenidos forzando display: none
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none"; // Forzamos ocultar
        contents[i].classList.remove("active");
    }

    // 2. Desactivar todos los botones
    const btns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
    }

    // 3. Mostrar SOLO el contenido seleccionado
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.style.display = "block"; // Forzamos mostrar
        selectedContent.classList.add("active");
    }
    
    // 4. Activar el botón correspondiente
    // Buscamos el botón cuyo onclick contenga el ID del tab
    for (let i = 0; i < btns.length; i++) {
         const onClickAttr = btns[i].getAttribute('onclick');
         if(onClickAttr && onClickAttr.includes(tabId)) {
             btns[i].classList.add("active");
         }
    }
};