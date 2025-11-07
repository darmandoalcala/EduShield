const Database = require('../config/database');

class UserController {
  // Obtener perfil de usuario
  static async getProfile(req, res) {
    try {
      const { userId } = req.params;

      const user = await Database.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.CODIGO_ESTUDIANTE,
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
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil de usuario
  static async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const { nombre, apellido, telefono, sexo, foto_perfil } = req.body;

      await Database.updateUser(userId, {
        nombre,
        apellido,
        telefono,
        sexo,
        foto_perfil
      });

      res.json({
        success: true,
        message: 'Perfil actualizado correctamente',
        data: {
          id: userId,
          nombre,
          apellido,
          telefono,
          sexo,
          foto_perfil,
          nombre_completo: `${nombre} ${apellido}`
        }
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = UserController;