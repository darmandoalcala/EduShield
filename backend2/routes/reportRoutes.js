const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

// Obtener estadísticas de reportes
router.get('/reports/stats', ReportController.getReportStats);

// Eliminar todos los reportes de un usuario (DEBE IR ANTES de /reports/:id)
router.delete('/reports/user/:codigo_estudiante/all', ReportController.deleteAllReportsByUser);

// Obtener reportes por usuario
router.get('/reports/user/:codigo_estudiante', ReportController.getReportsByUser);

// Obtener reportes por centro
router.get('/reports/center/:centro_id', ReportController.getReportsByCenter);

// Crear un nuevo reporte
router.post('/reports', ReportController.createReport);

// Obtener todos los reportes
router.get('/reports', ReportController.getAllReports);

// Obtener un reporte por ID (DESPUÉS de las rutas específicas)
router.get('/reports/:id', ReportController.getReportById);

// Actualizar estado de un reporte
router.put('/reports/:id/status', ReportController.updateReportStatus);

// Eliminar un reporte
router.delete('/reports/:id', ReportController.deleteReport);

module.exports = router;