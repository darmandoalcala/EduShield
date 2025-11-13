# EduShield

Una aplicación móvil para la seguridad y salud de los estudiantes en la Universidad de Guadalajara (UdeG), construida con React Native (Expo) y Node.js.

## Acerca del Proyecto

EduShield es una solución móvil diseñada para mejorar la seguridad en el campus. Permite a los estudiantes:
* Enviar **alertas de seguridad** en tiempo real a otros usuarios cercanos.
* Reportar **incidentes** (acoso, robo, problemas de infraestructura) con descripción.
* Adjuntar **evidencia fotográfica y de video** a sus reportes.
* Gestionar su **perfil de usuario**, incluyendo una foto de perfil personalizada.

El sistema utiliza AWS S3 para el almacenamiento seguro de archivos multimedia y WebSockets para la comunicación de alertas en tiempo real.

## ✨ Características Principales

* **Mapa de Alertas:** Visualización en tiempo real de alertas de usuarios en un mapa (Google Maps).
* **Reporte de Incidentes:** Formulario completo para reportar incidentes, incluyendo descripción y tipo.
* **Subida de Evidencia (S3):** Sube fotos (`.jpeg`) y videos (`.mp4`, `.mov`) directamente al bucket de AWS S3.
* **Perfiles de Usuario:** Los usuarios pueden editar su información personal y subir una foto de perfil.
* **Contexto de Usuario:** Gestión de estado global con React Context (`UserContext`, `LocationContext`).
* **Componentes Reutilizables:** `HeaderBar` que muestra la foto de perfil del contexto de usuario.

## 🛠️ Stack Tecnológico

* **Frontend (Móvil):**
    * React Native
    * Expo (SDK 54)
    * Expo Router (Navegación)
    * `react-native-maps` (Google Maps)
    * `expo-image-picker` (Acceso a cámara/galería)
    * `expo-av` (Manejo de video)
    * `@aws-sdk/client-s3` (Subida de archivos)
    * `socket.io-client` (Alertas en tiempo real)
* **Backend:**
    * Node.js
    * Python
    * Fast API
    * Express.js
    * Socket.io
    * IBM Db2
    * multer-s3
* **Infraestructura y DevOps:**
    * AWS S3 (Almacenamiento de archivos)
    * AWS IAM (Gestión de permisos)
    * IBM Db2 (Gestión de base de datos)
    * EAS Build (Compilación de APKs/dev clients)

---

## How To Start

Sigue estos pasos para configurar y ejecutar el proyecto localmente en un dev build.

### Prerrequisitos

* [Node.js](https://nodejs.org/) (LTS recomendado)
* [Git](https://git-scm.com/)
* `eas-cli` instalado globalmente: `npm install -g eas-cli`
* Una cuenta de AWS con un bucket S3 y credenciales de IAM.
* Una API Key de Google Maps (con "Maps SDK for Android" habilitado).


    npx expo start --dev-client --tunnel
    ```
8.  Abre la app "EduShield" (no Expo Go) en tu dispositivo. Debería conectarse al servidor de Metro.
