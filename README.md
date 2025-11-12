# Sistema de Información Geográfica (SIG)

Este repositorio contiene los recursos necesarios para implementar un entorno SIG basado en **PostgreSQL/PostGIS** y **QGIS**.

   1. Crear una nueva base de datos:
   
   CREATE DATABASE tpisig;

   2. Habilitar las extensiones necesarias:
      CREATE EXTENSION postgis;
      CREATE EXTENSION plpgsql;

   3. Restaurar el backup .sql (según el formato disponible)

   🧩 Workspace y capas locales

Cada usuario debe generar su propio workspace local dentro de QGIS, configurando sus layers (capas) en base a su conexión local a la base de datos.

Esto permite trabajar de forma independiente, sin modificar la configuración de los demás.

🧰 Requisitos

🐘 PostgreSQL
 17 o superior

🌍 PostGIS

🧭 QGIS
 3.30 o superior
