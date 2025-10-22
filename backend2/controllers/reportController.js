const Database = require('../config/database');

class ReportController {
  // Crear un nuevo reporte
  static async createReport(req, res) {
    try {
      console.log('📝 Creando nuevo reporte:', req.body);

      const {
        titulo,
        descripcion,
        coordenada_lat,
        coordenada_lng,
        categoria_id,
        nivel_riesgo,
        foto_evidencia,
        codigo_estudiante,
        centro_id
      } = req.body;

      // Validaciones básicas
      if (!titulo || !descripcion || !categoria_id || !nivel_riesgo || !codigo_estudiante || !centro_id) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios'
        });
      }

      // Insertar el reporte
      const sql = `
        INSERT INTO reportes (
          titulo, descripcion, coordenada_lat, coordenada_lng,
          categoria_id, nivel_riesgo, foto_evidencia, codigo_estudiante, centro_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        titulo,
        descripcion,
        coordenada_lat || null,
        coordenada_lng || null,
        categoria_id,
        nivel_riesgo,
        foto_evidencia || null,
        codigo_estudiante,
        centro_id
      ];

      await Database.query(sql, params);

      console.log('✅ Reporte creado exitosamente');

      res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error creando reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el reporte',
        error: error.message
      });
    }
  }

  // Obtener todos los reportes
  static async getAllReports(req, res) {
    try {
      console.log('📋 Obteniendo todos los reportes');

      const sql = `
        SELECT 
          r.*,
          u.nombre || ' ' || u.apellido as nombre_usuario,
          c.nombre as nombre_centro,
          cat.nombre as nombre_categoria
        FROM reportes r
        LEFT JOIN usuario u ON r.codigo_estudiante = u.codigo_estudiante
        LEFT JOIN centro_universitario c ON r.centro_id = c.id
        LEFT JOIN categorias_reporte cat ON r.categoria_id = cat.id
        ORDER BY r.fecha DESC
      `;

      const reportes = await Database.query(sql);

      res.status(200).json({
        success: true,
        data: reportes
      });

    } catch (error) {
      console.error('❌ Error obteniendo reportes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los reportes',
        error: error.message
      });
    }
  }

  // Obtener reportes por usuario
  static async getReportsByUser(req, res) {
    try {
      const { codigo_estudiante } = req.params;
      console.log('📋 Obteniendo reportes del usuario:', codigo_estudiante);

      const sql = `
        SELECT 
          r.*,
          c.nombre as nombre_centro,
          cat.nombre as nombre_categoria
        FROM reportes r
        LEFT JOIN centro_universitario c ON r.centro_id = c.id
        LEFT JOIN categorias_reporte cat ON r.categoria_id = cat.id
        WHERE r.codigo_estudiante = ?
        ORDER BY r.fecha DESC
      `;

      const reportes = await Database.query(sql, [codigo_estudiante]);

      res.status(200).json({
        success: true,
        data: reportes
      });

    } catch (error) {
      console.error('❌ Error obteniendo reportes del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los reportes del usuario',
        error: error.message
      });
    }
  }

  // Obtener un reporte por ID
  static async getReportById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Obteniendo reporte:', id);

      const sql = `
        SELECT 
          r.*,
          u.nombre || ' ' || u.apellido as nombre_usuario,
          u.email as email_usuario,
          c.nombre as nombre_centro,
          cat.nombre as nombre_categoria
        FROM reportes r
        LEFT JOIN usuario u ON r.codigo_estudiante = u.codigo_estudiante
        LEFT JOIN centro_universitario c ON r.centro_id = c.id
        LEFT JOIN categorias_reporte cat ON r.categoria_id = cat.id
        WHERE r.id = ?
      `;

      const result = await Database.query(sql, [id]);

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Reporte no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: result[0]
      });

    } catch (error) {
      console.error('❌ Error obteniendo reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el reporte',
        error: error.message
      });
    }
  }

  // Actualizar estado de un reporte
  static async updateReportStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      console.log(`📝 Actualizando estado del reporte ${id} a:`, estado);

      // Validar que el estado sea válido
      const estadosValidos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido'
        });
      }

      const sql = `UPDATE reportes SET estado = ? WHERE id = ?`;
      await Database.query(sql, [estado, id]);

      console.log('✅ Estado actualizado exitosamente');

      res.status(200).json({
        success: true,
        message: 'Estado actualizado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado',
        error: error.message
      });
    }
  }

  // Eliminar un reporte
  static async deleteReport(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Eliminando reporte:', id);

      const sql = `DELETE FROM reportes WHERE id = ?`;
      await Database.query(sql, [id]);

      console.log('✅ Reporte eliminado exitosamente');

      res.status(200).json({
        success: true,
        message: 'Reporte eliminado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error eliminando reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el reporte',
        error: error.message
      });
    }
  }

  // Obtener reportes por centro universitario
  static async getReportsByCenter(req, res) {
    try {
      const { centro_id } = req.params;
      console.log('📋 Obteniendo reportes del centro:', centro_id);

      const sql = `
        SELECT 
          r.*,
          u.nombre || ' ' || u.apellido as nombre_usuario,
          cat.nombre as nombre_categoria
        FROM reportes r
        LEFT JOIN usuario u ON r.codigo_estudiante = u.codigo_estudiante
        LEFT JOIN categorias_reporte cat ON r.categoria_id = cat.id
        WHERE r.centro_id = ?
        ORDER BY r.fecha DESC
      `;

      const reportes = await Database.query(sql, [centro_id]);

      res.status(200).json({
        success: true,
        data: reportes
      });

    } catch (error) {
      console.error('❌ Error obteniendo reportes del centro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los reportes del centro',
        error: error.message
      });
    }
  }

  // Obtener estadísticas de reportes
  static async getReportStats(req, res) {
    try {
      console.log('📊 Obteniendo estadísticas de reportes');

      const sql = `
        SELECT 
          COUNT(*) as total_reportes,
          SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN estado = 'en_revision' THEN 1 ELSE 0 END) as en_revision,
          SUM(CASE WHEN estado = 'resuelto' THEN 1 ELSE 0 END) as resueltos,
          SUM(CASE WHEN estado = 'rechazado' THEN 1 ELSE 0 END) as rechazados
        FROM reportes
      `;

      const result = await Database.query(sql);

      res.status(200).json({
        success: true,
        data: result[0]
      });

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error.message
      });
    }
  }
}

module.exports = ReportController;