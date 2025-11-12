// static/map.js
import { URL_OGC } from './url.js';

// Definiciones de capas WMS de GeoServer
const layersConfig = [
	{ id: 'red_vial', title: 'Red Vial', workspaceLayer: 'Red_Vial', visible: false },
    { id: 'edif_educacion', title: 'Edificios de Educación', workspaceLayer: 'Edif_Educacion', visible: false },
    { id: 'espejo_de_agua_Hid', title: 'Espejo de Agua', workspaceLayer: 'Espejo_de_Agua_Hid', visible: false },
    { id: 'localidades', title: 'Localidades', workspaceLayer: 'Localidades', visible: false },
    { id: 'curso_de_agua_hid', title: 'Curso de Agua', workspaceLayer: 'Curso_de_Agua_Hid', visible: false }
];

const wmsLayers = [];
const vectorLayers = {}; // Para almacenar las capas vectoriales, usando id como clave

// Capa base del IGN
const baseLayer = new ol.layer.Tile({
    title: "Base Map IGN",
    source: new ol.source.TileWMS({
        url: 'https://wms.ign.gob.ar/geoserver/ows',
        params: {
            LAYERS: 'ign:provincia',
            VERSION: '1.3.0'
        },
        serverType: 'geoserver'
    })
});

// Crear las capas WMS y vectoriales
layersConfig.forEach(config => {
    if (config.isVector) {
        const vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: config.url // Asume que el GeoJSON está en static/espejos_de_agua.geojson
        });
        const vectorLayer = new ol.layer.Vector({
            title: config.title,
            id: config.id, // Añadir ID para referencia
            source: vectorSource,
            visible: config.visible,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 204, 51, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000000',
                        width: 1
                    })
                })
            })
        });
        wmsLayers.push(vectorLayer);
        vectorLayers[config.id] = vectorLayer; // Almacenar por ID
    } else {
        const layer = new ol.layer.Image({
            title: config.title,
            id: config.id, // Añadir ID para referencia
            visible: config.visible,
            source: new ol.source.ImageWMS({
                url: URL_OGC,
                params: {
                    LAYERS: config.workspaceLayer
                },
                serverType: 'geoserver' // Importante para OpenLayers 6+
            })
        });
        wmsLayers.push(layer);
    }
});


// Configuración inicial del mapa
const map = new ol.Map({
    target: 'map',
    layers: [baseLayer, ...wmsLayers],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [-59, -27.5],
        zoom: 4
    })
});

// Elementos del DOM
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
// 1. Navegación del mapa (paneo, zoom, etc.) - Ya incluido por defecto
// =========================================================================
// OpenLayers provee estas funcionalidades por defecto.


// =========================================================================
// 2. Activar/Desactivar capas y refresco
// =========================================================================

// Generar checkboxes dinámicamente o usar los existentes con los IDs correctos
wmsLayers.forEach(layer => {
    // Asegúrate de que los IDs de los checkboxes en index.html sean como 'check_layer_red_vial'
    const checkbox = document.querySelector(`#check_layer_${layer.get('id')}`);
    if (checkbox) {
        checkbox.checked = layer.getVisible();
        checkbox.addEventListener('change', function () {
            const checked = this.checked;
            if (checked !== layer.getVisible()) {
                layer.setVisible(checked);
                // ¡Añadir esta línea para refrescar el source!
                if (layer.getSource() && typeof layer.getSource().refresh === 'function') {
                    layer.getSource().refresh();
                }
                updateLegend();
                saveMapState(); // Guardar estado de visibilidad
            }
        });
        layer.on('change:visible', function () {
            const visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
                // ¡Añadir esta línea para refrescar el source!
                if (this.getSource() && typeof this.getSource().refresh === 'function') {
                    this.getSource().refresh();
                }
                updateLegend();
                saveMapState(); // Guardar estado de visibilidad
            }
        });
    }
});

// =========================================================================
// 3. Mostrar la leyenda de las capas y escala de visualización
// =========================================================================

function updateLegend() {
    legendPanel.innerHTML = ''; // Limpiar leyenda actual
    wmsLayers.forEach(layer => {
        if (layer.getVisible()) {
            const title = layer.get('title');
            const layerId = layer.get('id');
            const source = layer.getSource();

            // Leyendas para capas WMS (se asume que GeoServer soporta GetLegendGraphic)
            if (source instanceof ol.source.ImageWMS || source instanceof ol.source.TileWMS) {
                const legendUrl = `${source.getUrl()}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${source.getParams().LAYERS}`;
                const legendDiv = document.createElement('div');
                legendDiv.innerHTML = `<h4>${title}</h4><img src="${legendUrl}" alt="Leyenda de ${title}">`;
                legendPanel.appendChild(legendDiv);
            }
            // Para capas vectoriales, podríamos mostrar un ejemplo de estilo o un texto descriptivo
            else if (layerId === 'espejos_de_agua') {
                const legendDiv = document.createElement('div');
                legendDiv.innerHTML = `<h4>${title}</h4><p>Polígonos de espejos de agua.</p>`;
                legendPanel.appendChild(legendDiv);
            }
        }
    });
}

// Escala de visualización
map.on('moveend', function () {
    const view = map.getView();
    const resolution = view.getResolution();
    const projection = view.getProjection();
    const center = view.getCenter(); // Necesitamos un punto para la resolución geográfica

    let scale;

    // Verificar si la proyección es geográfica (usa grados)
    if (projection.getUnits() === 'degrees') {
        const pointResolution = ol.proj.getPointResolution(
            projection,
            resolution,
            center,
            'm' // Queremos la resolución en metros
        );
        const dpi = 25.4 / 0.28; // Estimación de DPI (puntos por pulgada)
        const inchesPerMeter = 1 / 0.0254;

        scale = Math.round(pointResolution * inchesPerMeter * dpi);

    } else {
        // Para proyecciones métricas (como UTM), se usa el método original
        const units = projection.getUnits();
        const dpi = 25.4 / 0.28;
        const mpu = ol.proj.METERS_PER_UNIT[units];
        scale = Math.round(resolution * mpu * 39.37 * dpi); // 39.37 pulgadas por metro
    }

    scaleInfo.innerHTML = `Escala: 1:${scale}`;
    saveMapState(); // Guardar estado de la vista (centro y zoom)
});


// =========================================================================
// Funciones para guardar y cargar el estado del mapa (persistir en localStorage)
// =========================================================================

function saveMapState() {
    const view = map.getView();
    const center = view.getCenter();
    const zoom = view.getZoom();
    const visibleLayers = wmsLayers
        .filter(layer => layer.getVisible())
        .map(layer => layer.get('id'));

    localStorage.setItem('mapState', JSON.stringify({
        center: center,
        zoom: zoom,
        visibleLayers: visibleLayers,
        // Puedes añadir aquí el estado de los controles activos o features seleccionadas
        // La persistencia de la selección de features es más compleja, ya que requeriría
        // guardar los IDs de las features seleccionadas y luego volver a seleccionarlas
        // programáticamente al cargar, lo cual no está implementado aquí.
    }));
}

function loadMapState() {
    const savedState = localStorage.getItem('mapState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const view = map.getView();

        if (state.center && state.zoom) {
            view.setCenter(state.center);
            view.setZoom(state.zoom);
        }

        if (state.visibleLayers && Array.isArray(state.visibleLayers)) {
            wmsLayers.forEach(layer => {
                const isVisible = state.visibleLayers.includes(layer.get('id'));
                layer.setVisible(isVisible);
                // Asegurarse de que el checkbox también se actualice
                const checkbox = document.querySelector(`#check_layer_${layer.get('id')}`);
                if (checkbox) {
                    checkbox.checked = isVisible;
                }
            });
            updateLegend(); // Recargar la leyenda con las capas correctas
        }
        // Aquí podrías cargar el estado de los controles y features seleccionadas si se implementó
    }
}


// =========================================================================
// 4. Consulta gráfica (punto y rectángulo) para cada capa
// =========================================================================

let highlightLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 0.7)',
            width: 3,
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.3)',
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.7)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 1)',
                width: 2,
            }),
        }),
    }),
});
map.addLayer(highlightLayer);

let currentInteraction = null;

function activateInteraction(type) {
    if (currentInteraction) {
        map.removeInteraction(currentInteraction);
        highlightLayer.getSource().clear(); // Limpiar features resaltadas
        selectedFeaturesInfo.innerHTML = '&nbsp;'; // Limpiar información
        measurementOutput.innerHTML = '&nbsp;'; // Limpiar información de medición
        // Remover tooltips y listeners de medición si estaban activos
        if (measureTooltipElement && measureTooltipElement.parentNode) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        if (helpTooltipElement && helpTooltipElement.parentNode) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        map.un('pointermove', pointerMoveHandler);
        vector.getSource().clear(); // Limpiar dibujos de medición
        // Remover capa de dibujo temporal si existe
        map.getLayers().forEach(layer => {
            if (layer instanceof ol.layer.Vector && layer.get('isDrawLayer')) {
                map.removeLayer(layer);
            }
        });
    }

    if (type === 'consulta_punto') {
        currentInteraction = new ol.interaction.Pointer({
            handleDownEvent: function (evt) {
                return true; // Permitir que el evento pase
            },
            handleUpEvent: function (evt) {
                const coordinate = evt.coordinate;
                performGetFeatureInfo(coordinate, 'POINT');
                return true;
            }
        });
    } else if (type === 'consulta_rectangulo') {
        currentInteraction = new ol.interaction.DragBox({
            condition: ol.events.condition.noModifierKeys,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 0, 255, 1],
                    width: 2,
                }),
            }),
        });
        currentInteraction.on('boxend', function () {
            const extent = currentInteraction.getGeometry().getExtent();
            performGetFeatureInfo(extent, 'BBOX');
        });
    } else if (type === 'medicion_distancia') {
        addMeasureInteraction();
    } else if (type.startsWith('dibujo_')) {
        addDrawInteraction(type.replace('dibujo_', ''));
    } else if (type === 'navegacion') {
        // No hay interacción específica, solo las de navegación por defecto.
    }

    if (currentInteraction) {
        map.addInteraction(currentInteraction);
    }
}

async function performGetFeatureInfo(geometry, type) {
    selectedFeaturesInfo.innerHTML = 'Consultando...';
    highlightLayer.getSource().clear();

    const view = map.getView();
    const viewResolution = view.getResolution();
    const projection = view.getProjection();

    const infoPromises = wmsLayers
        .filter(layer => layer.getVisible() && (layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS))
        .map(layer => {
            const source = layer.getSource();
            let url;
            if (type === 'POINT') {
                url = source.getFeatureInfoUrl(
                    geometry,
                    viewResolution,
                    projection,
                    { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': source.getParams().LAYERS }
                );
            } else if (type === 'BBOX') {
                // Para consultas de caja en WMS, se necesita WFS GetFeature con filtro BBOX,
                // que es más complejo y no está directamente en GetFeatureInfo.
                // Aquí, para WMS en BBOX, devolveremos una promesa resuelta vacía.
                console.warn('Consulta por BBOX en capas WMS no es directamente soportada por GetFeatureInfo con INFO_FORMAT=application/json.');
                return Promise.resolve({ layer: layer.get('title'), features: [] });
            }

            if (url) {
                return fetch(url)
                    .then(response => response.json())
                    .then(data => ({ layer: layer.get('title'), features: data.features }))
                    .catch(error => {
                        console.error('Error fetching feature info:', error);
                        return { layer: layer.get('title'), features: [] };
                    });
            }
            return Promise.resolve({ layer: layer.get('title'), features: [] });
        });

    // Añadir consulta a capas vectoriales locales
    const vectorInfoPromises = Object.values(vectorLayers)
        .filter(layer => layer.getVisible())
        .map(layer => {
            const vectorSource = layer.getSource();
            let features = [];

            if (type === 'POINT') {
                map.forEachFeatureAtPixel(map.getPixelFromCoordinate(geometry), function (feature, layer_) {
                    if (layer_ === layer) {
                        features.push(feature);
                    }
                });
            } else if (type === 'BBOX') {
                const boxExtent = geometry;
                features = vectorSource
                    .getFeaturesInExtent(boxExtent)
                    .filter(feature => feature.getGeometry().intersectsExtent(boxExtent));
            }

            return Promise.resolve({ layer: layer.get('title'), features: features });
        });

    const allInfoPromises = [...infoPromises, ...vectorInfoPromises];

    Promise.all(allInfoPromises)
        .then(results => {
            let infoHtml = '<h4>Resultados de la consulta:</h4>';
            let totalFeatures = 0;
            results.forEach(result => {
                if (result.features && result.features.length > 0) {
                    infoHtml += `<h5>Capa: ${result.layer}</h5><ul>`;
                    result.features.forEach(feature => {
                        totalFeatures++;
                        // Si es GeoJSON, los atributos están en feature.properties
                        const properties = feature.properties || feature.getProperties();
                        infoHtml += `<li>`;
                        for (const key in properties) {
                            if (properties.hasOwnProperty(key) && key !== 'geometry' && key !== 'geom') {
                                infoHtml += `<strong>${key}</strong>: ${properties[key]}<br>`;
                            }
                        }
                        infoHtml += `</li>`;

                        // Resaltar la feature
                        // Asegurarse de que la geometría se lea correctamente
                        let geom;
                        if (feature.geometry) { // Si es un objeto GeoJSON
                            geom = new ol.format.GeoJSON().readGeometry(feature.geometry);
                        } else if (feature.getGeometry) { // Si ya es una feature de OL
                            geom = feature.getGeometry();
                        }
                        
                        if (geom) {
                            const highlightFeature = new ol.Feature({ geometry: geom });
                            highlightLayer.getSource().addFeature(highlightFeature);
                        }
                    });
                    infoHtml += `</ul>`;
                }
            });

            if (totalFeatures === 0) {
                infoHtml = 'No se encontraron features.';
            }
            selectedFeaturesInfo.innerHTML = infoHtml;
        })
        .catch(error => {
            selectedFeaturesInfo.innerHTML = 'Error al consultar features.';
            console.error('Error general en la consulta:', error);
        });
}


// Manejador de eventos para los radio buttons de interacción
mapInteractions.addEventListener('change', function (event) {
    if (event.target.name === 'controles') {
        const selectedValue = event.target.value;
        activateInteraction(selectedValue);
        // Mostrar/ocultar panel de atributos de dibujo
        drawingAttributesDiv.style.display = selectedValue.startsWith('dibujo_') ? 'block' : 'none';
        // Limpiar el formulario de dibujo
        featureNameInput.value = '';
        drawLayerSelect.value = Object.keys(vectorLayers)[0] || ''; // Seleccionar la primera capa vectorial disponible por defecto
    }
});


// =========================================================================
// 5. Medición de distancias
// =========================================================================

let drawMeasure; // Interacción de dibujo para medición
let sketch; // Feature de dibujo actual
let helpTooltipElement; // Elemento del tooltip para ayuda
let helpTooltip; // Overlay para el tooltip de ayuda
let measureTooltipElement; // Elemento del tooltip para la medición
let measureTooltip; // Overlay para el tooltip de medición
let continuePolygonMsg = 'Click para continuar el polígono, doble click para finalizar';
let continueLineMsg = 'Click para continuar la línea, doble click para finalizar';

const source = new ol.source.Vector();
const vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
        })
    })
});
map.addLayer(vector);

function addMeasureInteraction() {
    activateInteraction(null); // Limpiar interacciones anteriores sin activar nada nuevo inmediatamente
    // La interacción de medición se gestiona aquí directamente

    source.clear(); // Limpiar dibujos anteriores
    measurementOutput.innerHTML = '';
    createHelpTooltip();
    createMeasureTooltip();

    drawMeasure = new ol.interaction.Draw({
        source: source,
        type: 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(drawMeasure);
    currentInteraction = drawMeasure; // Asignar a la interacción actual

    drawMeasure.on('drawstart', function (evt) {
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;
        sketch.on('change', function (evt) {
            const geom = evt.target.getGeometry();
            let output;
            if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    drawMeasure.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
    });

    map.on('pointermove', pointerMoveHandler);
    map.getViewport().addEventListener('mouseout', function () {
        if (helpTooltipElement) {
            helpTooltipElement.classList.add('hidden');
        }
    });
}

function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}

function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false
    });
    map.addOverlay(measureTooltip);
}

const pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    let helpMsg = 'Click para empezar a dibujar';

    if (sketch) {
        const geom = sketch.getGeometry();
        if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        } else if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        }
    }

    if (helpTooltipElement) {
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);
        helpTooltipElement.classList.remove('hidden');
    }
};

const formatLength = function (line) {
    // Obtén el objeto de proyección completo
    const sphericalProjection = ol.proj.get('EPSG:4326');

    // Pasa el objeto de proyección a getLength
    const length = ol.sphere.getLength(line, { projection: sphericalProjection });
    
    let output;
    if (length > 100) {
        output = Math.round(length / 1000 * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};


// =========================================================================
// 6. Ingresar nuevos elementos (features) en una capa vectorial
// =========================================================================

let drawInteraction; // Interacción para dibujar nuevas geometrías
let drawnFeature; // La feature que se está dibujando

function addDrawInteraction(type) {
    activateInteraction(null); // Limpiar interacciones anteriores sin activar nada nuevo inmediatamente

    // Configurar la capa de dibujo temporal
    const drawSource = new ol.source.Vector();
    const drawLayer = new ol.layer.Vector({
        source: drawSource,
        isDrawLayer: true, // Marcador para identificar esta capa temporal
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFD700', // Dorado
                width: 3
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#FFD700'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            })
        })
    });
    map.addLayer(drawLayer);

    drawInteraction = new ol.interaction.Draw({
        source: drawSource,
        type: type === 'line' ? 'LineString' : (type === 'point' ? 'Point' : 'Polygon'),
    });
    map.addInteraction(drawInteraction);
    currentInteraction = drawInteraction;

    drawInteraction.on('drawend', function (evt) {
        drawnFeature = evt.feature;
        alert('Feature dibujada. Ingresa los atributos y guárdala.');
    });

    saveFeatureBtn.onclick = async function () {
        if (!drawnFeature) {
            alert('Primero dibuja una característica.');
            return;
        }

        const selectedLayerId = drawLayerSelect.value;
        const featureName = featureNameInput.value;

        if (!selectedLayerId) {
            alert('Selecciona una capa para guardar la característica.');
            return;
        }
        if (!featureName) {
            alert('Ingresa un nombre para la característica.');
            return;
        }

        // Convertir la geometría a GeoJSON
        const format = new ol.format.GeoJSON();
        const geojson = format.writeFeatureObject(drawnFeature, {
            featureProjection: 'EPSG:4326', // Proyección de la feature en el mapa
            dataProjection: 'EPSG:4326'     // Proyección de los datos en el JSON (para PostGIS)
        });

        // Añadir atributos personalizados
        geojson.properties = {
            ...geojson.properties, // Mantener propiedades existentes si las hay
            name: featureName,
        };

        try {
            const response = await fetch('/features', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    layer: selectedLayerId,
                    feature: geojson
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Feature guardada exitosamente: ' + result.message);
                // Opcional: Recargar la capa vectorial para ver la nueva feature
                if (vectorLayers[selectedLayerId] && vectorLayers[selectedLayerId].getSource()) {
                    vectorLayers[selectedLayerId].getSource().refresh();
                }
                drawSource.clear(); // Limpiar la feature dibujada temporalmente
                drawnFeature = null;
                featureNameInput.value = '';
                // Al volver a navegación, se encarga de limpiar las interacciones y capas de dibujo
                document.getElementById('controles_navegacion').checked = true;
                activateInteraction('navegacion');
            } else {
                alert('Error al guardar la feature: ' + result.error);
                console.error('Server error:', result.error);
            }
        } catch (error) {
            alert('Error de conexión al servidor.');
            console.error('Fetch error:', error);
        }
    };

    cancelDrawBtn.onclick = function() {
        drawSource.clear(); // Limpiar la feature dibujada temporalmente
        drawnFeature = null;
        featureNameInput.value = '';
        // Al volver a navegación, se encarga de limpiar las interacciones y capas de dibujo
        document.getElementById('controles_navegacion').checked = true;
        activateInteraction('navegacion');
    };
}


// Inicializar la interacción de navegación por defecto y cargar el estado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Poblar el selector de capas para dibujar (si tienes varias vectoriales)
    // Asegurarse de que el elemento <select> tenga el id 'draw-layer-select'
    for (const id in vectorLayers) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = vectorLayers[id].get('title');
        drawLayerSelect.appendChild(option);
    }

    // Cargar el estado del mapa ANTES de activar la interacción por defecto
    // para que la vista y capas visibles se ajusten primero.
    loadMapState();

    // Activar la interacción de navegación por defecto
    // Esto también se encarga de limpiar cualquier interacción o dibujo anterior.
    document.getElementById('controles_navegacion').checked = true; // Asegurarse de que el radio button esté marcado
    activateInteraction('navegacion');

    // Actualizar leyenda y escala al cargar el mapa (si no se hizo ya en loadMapState)
    // Forzar la actualización de la escala y leyenda inicial
    map.dispatchEvent('moveend');
    updateLegend();
});


// Estilos para los tooltips de medición (pueden ir en style.css o aquí)
const style = document.createElement('style');
style.innerHTML = `
    .ol-tooltip {
        position: relative;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 4px;
        color: #fff;
        padding: 4px 8px;
        opacity: 0.7;
        white-space: nowrap;
        font-size: 12px;
        cursor: default;
        user-select: none;
    }
    .ol-tooltip-measure {
        opacity: 1;
        font-weight: bold;
    }
    .ol-tooltip-static {
        background-color: #ffcc33;
        color: black;
        border: 1px solid white;
    }
    .ol-tooltip-measure:before,
    .ol-tooltip-static:before {
        border-top: 6px solid rgba(0, 0, 0, 0.7);
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        content: "";
        position: absolute;
        bottom: -6px;
        margin-left: -7px;
        left: 50%;
    }
    .ol-tooltip-static:before {
        border-top-color: #ffcc33;
    }
`;
document.head.appendChild(style);