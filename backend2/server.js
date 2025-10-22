const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
<<<<<<< HEAD
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api', reportRoutes);
=======
const contactsRoutes = require('./routes/contacts');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoutes);
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'EduShield Backend API funcionando',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register', 
      '/api/auth/login',
      '/api/reports' // Agregado al listado
    ]
  });
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 Listo para recibir requests de la app móvil`);
});

module.exports = app;