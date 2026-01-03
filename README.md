# 🚀 Proyecto Full Stack SPA - Laboratorio 6, 7 & 8

Este repositorio contiene el proyecto final del Módulo 6 de Desarrollo Web Full Stack. Es una aplicación web tipo SPA (Single Page Application) que integra un Backend en Node.js/Express con un Frontend en React.

Actualmente, el proyecto se encuentra en proceso de migración y contenerización para el **Laboratorio 8**.

## 📋 Características Principales

* **Gestión de Usuarios:** API RESTful para crear, leer y administrar usuarios(Demo).
* **Integración de APIs Externas:** Módulo de Clima (Weather API) "Laboratorio 7".
* **Playground:** Área de pruebas para funcionalidades experimentales.
* **Base de Datos:** Persistencia de datos utilizando MongoDB.

## 🛠 Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express
* **Base de Datos:** MongoDB (Mongoose)
* **Herramientas:** Git, VS Code

## 📂 Estructura del Proyecto

El proyecto utiliza una arquitectura de monorepo separado por carpetas:

```text
proyecto-spa/
├── backend/            # Servidor API (Node/Express)
│   ├── config/         # Configuración de DB
│   ├── models/         # Modelos Mongoose (User, etc.)
│   ├── routes/         # Rutas de la API
│   ├── server.js       # Punto de entrada del servidor
│   └── .env            # (No incluido en repo) Variables de entorno
├── frontend/           # Cliente Web (React)
│   ├── src/            # Componentes y vistas
│   └── public/         # Assets estáticos
└── README.md           # Documentación
