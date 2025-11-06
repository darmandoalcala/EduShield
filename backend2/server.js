// backend2/server.js
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
app.use(express.urlencoded({ extended: true })); // ← Necesario para FormData

// ============================================
// IMPORTACION DE RUTAS
// ============================================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploadRoutes'); // 👈 súbela antes
const reportRoutes = require('./routes/reportRoutes');
const contactsRoutes = require('./routes/contacts');

// ============================================
// CONFIGURACION DE RUTAS
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes); // 👈 aquí arriba del reportRoutes
app.use('/api/contacts', contactsRoutes);
app.use('/api', reportRoutes); // 👈 esta SIEMPRE va al final

console.log('Todas las rutas registradas correctamente');

// ============================================
// RUTAS DE INFORMACION Y SALUD
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'EduShield Backend API funcionando',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register', 
      '/api/auth/login',
      '/api/reports',
      '/api/upload'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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