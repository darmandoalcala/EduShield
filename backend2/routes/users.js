const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// GET /api/users/:userId - Obtener perfil
router.get('/:userId', UserController.getProfile);

// PUT /api/users/:userId - Actualizar perfil
router.put('/:userId', UserController.updateProfile);

module.exports = router;