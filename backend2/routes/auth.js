const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Registrar usuario
router.post('/register', AuthController.register);

// POST /api/auth/login - Login de usuario
router.post('/login', AuthController.login);

// GET /api/auth/test - Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Rutas de autenticación funcionando',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

module.exports = router;