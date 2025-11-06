const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// IMPORTACION DE RUTAS
// ============================================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reportRoutes');
const contactsRoutes = require('./routes/contacts');
const uploadRoutes = require('./routes/uploadRoutes');

// ============================================
// CONFIGURACION DE RUTAS
// ============================================
// Autenticacion
app.use('/api/auth', authRoutes);

// Usuarios
app.use('/api/users', userRoutes);

// Reportes
app.use('/api', reportRoutes);

// Contactos
app.use('/api/contacts', contactsRoutes);

// Uploads de archivos (fotos y videos)
app.use('/api/upload', uploadRoutes);

// ============================================
// RUTAS DE INFORMACION Y SALUD
// ============================================
// Ruta principal - informacion de la API
app.get('/', (req, res) => {
  res.json({ 
    message: 'EduShield Backend API funcionando',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register', 
      '/api/auth/login',
      '/api/reports',
      '/api/upload/evidence'
    ]
  });
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Listo para recibir requests de la app movil`);
  console.log(`AWS S3 configurado para bucket: ${process.env.AWS_BUCKET_NAME}`);
});

module.exports = app;