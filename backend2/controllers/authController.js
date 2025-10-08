// backend2/controllers/authController.js

const bcrypt = require('bcryptjs');
const Database = require('../config/database');

class AuthController {
  // Verificar si un email ya existe
  static async checkEmail(req, res) {
    try {
      console.log('📧 Request body recibido:', req.body);
      const { email } = req.body;

      if (!email) {
        console.log('❌ Email vacío');
        return res.status(400).json({ 
          exists: false,
          message: 'Email es requerido' 
        });
      }

      console.log('🔍 Validando formato del email:', email);
      
      // Validar formato de email UDG
      const emailRegex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
      if (!emailRegex.test(email)) {
        console.log('❌ Formato inválido');
        return res.status(400).json({ 
          exists: false,
          message: 'Debe ser un correo institucional (@alumnos.udg.mx)' 
        });
      }

      console.log('✅ Formato válido, buscando en BD...');
      
      // Buscar usuario en la base de datos
      const existingUser = await Database.findUserByEmail(email.toLowerCase().trim());
      
      console.log('📊 Resultado de búsqueda:', existingUser);

      if (existingUser) {
        console.log('✅ Email encontrado en BD');
        return res.status(200).json({ 
          exists: true,
          message: 'Este correo ya está registrado' 
        });
      }

      console.log('✅ Email disponible');
      return res.status(200).json({ 
        exists: false,
        message: 'Correo disponible' 
      });

    } catch (error) {
      console.error('❌ Error verificando email:', error);
      return res.status(500).json({ 
        exists: false,
        message: 'Error al verificar el correo' 
      });
    }
  }

  // Registrar nuevo usuario
  static async register(req, res) {
    try {
      console.log('Datos recibidos para registro:', req.body);
      
      const {
        codigo_estudiante,
        nombre_completo,
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

      // Verificar si el email ya existe
      const existingUserByEmail = await Database.findUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: 'El correo ya existe'
        });
      }

      // Verificar si el código de estudiante ya existe
      const existingUserByCode = await Database.findUserByCodigoEstudiante(codigo_estudiante);
      if (existingUserByCode) {
        return res.status(409).json({
          success: false,
          message: 'El código de estudiante ya existe'
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
        rol_id: 1,
        centro_id: 1
      };

      // Insertar en la base de datos
      const result = await Database.insertUser(userData);

      console.log('Usuario registrado exitosamente:', email);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: codigo_estudiante,
          codigo_estudiante: codigo_estudiante,
          nombre: nombre,
          apellido: apellido,
          email: email,
          telefono: telefono,
          sexo: sexo,
          nombre_completo: `${nombre} ${apellido}`
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error.message && error.message.includes('DUPLICATE')) {
        return res.status(409).json({
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

  // Login de usuario
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

      console.log('✅ Enviando respuesta al frontend:', {
        id: user.CODIGO_ESTUDIANTE,
        nombre: user.NOMBRE,
        apellido: user.APELLIDO
      }); 

      res.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: user.CODIGO_ESTUDIANTE, // 👈 CAMBIAR AQUÍ: usar CODIGO_ESTUDIANTE
          codigo_estudiante: user.CODIGO_ESTUDIANTE,
          nombre: user.NOMBRE,
          apellido: user.APELLIDO,
          email: user.EMAIL,
          telefono: user.TELEFONO,
          sexo: user.SEXO,
          foto_perfil: user.FOTO_PERFIL,
          nombre_completo: `${user.NOMBRE} ${user.APELLIDO}`
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