// backend2/controllers/authController.js

const bcrypt = require('bcryptjs');
const Database = require('../config/database');

class AuthController {
  // Registrar nuevo usuario
  static async register(req, res) {
    try {
      console.log('Datos recibidos para registro:', req.body);
      
      const {
        codigo_estudiante,
        nombre_completo, // viene del formulario
        email,
        password,
        sexo,
        telefono
      } = req.body;

      // Validaciones básicas
      if (!codigo_estudiante || !nombre_completo || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Campos obligatorios: código estudiantil, nombre completo, email y contraseña'
        });
      }

      // Dividir nombre completo en nombre y apellido
      const nombreCompleto = nombre_completo.trim().split(' ');
      const nombre = nombreCompleto[0];
      const apellido = nombreCompleto.slice(1).join(' ') || nombreCompleto[0];

      // Verificar si el usuario ya existe
      const existingUser = await Database.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con este email'
        });
      }

      // Encriptar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Datos del usuario para insertar
      const userData = {
        codigo_estudiante: codigo_estudiante,
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: hashedPassword,
        telefono: telefono,
        sexo: sexo,
        foto_perfil: null,
        rol_id: 1, // 1 = estudiante por defecto
        centro_id: 1 // 1 = CUCEI por defecto
      };

      // Insertar en la base de datos
      await Database.insertUser(userData);

      console.log('Usuario registrado exitosamente:', email);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          codigo_estudiante: codigo_estudiante,
          nombre: nombre,
          apellido: apellido,
          email: email
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      
      // Error específico de DB2
      if (error.message && error.message.includes('DUPLICATE')) {
        return res.status(400).json({
          success: false,
          message: 'El código estudiantil o email ya está registrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Login de usuario (para después)
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      // Buscar usuario
      const user = await Database.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.PASSWORD);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          codigo_estudiante: user.CODIGO_ESTUDIANTE,
          nombre: user.NOMBRE,
          apellido: user.APELLIDO,
          email: user.EMAIL
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;