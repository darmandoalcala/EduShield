const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

// Crear un nuevo reporte
router.post('/reports', ReportController.createReport);

// Obtener todos los reportes
router.get('/reports', ReportController.getAllReports);

// Obtener reportes por usuario
router.get('/reports/user/:codigo_estudiante', ReportController.getReportsByUser);

// Obtener reportes por centro
router.get('/reports/center/:centro_id', ReportController.getReportsByCenter);

// Obtener estadísticas de reportes
router.get('/reports/stats', ReportController.getReportStats);

// Obtener un reporte por ID
router.get('/reports/:id', ReportController.getReportById);

// Actualizar estado de un reporte
router.put('/reports/:id/status', ReportController.updateReportStatus);

// Eliminar un reporte
router.delete('/reports/:id', ReportController.deleteReport);

module.exports = router;