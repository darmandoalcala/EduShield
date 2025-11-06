const express = require('express');
const router = express.Router();
const { upload, deleteFromS3 } = require('../config/s3Config');

// Subir evidencia (foto o video)
router.post('/evidence', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se subió ningún archivo' 
      });
    }

    res.json({
      success: true,
      message: 'Archivo subido exitosamente',
      fileUrl: req.file.location,
      fileName: req.file.key,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al subir archivo',
      error: error.message 
    });
  }
});

// Eliminar evidencia
router.delete('/evidence', async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL del archivo requerida' 
      });
    }

    const result = await deleteFromS3(fileUrl);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar archivo',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar archivo',
      error: error.message 
    });
  }
});

module.exports = router;