const express = require('express');
const router = express.Router();
const { upload, deleteFromS3 } = require('../config/s3Config');

// ============================================
// SUBIR ARCHIVO (FOTO O VIDEO)
// ============================================
router.post('/', upload.single('file'), (req, res) => {
  console.log('POST /api/upload → Request recibido');

  try {
    if (!req.file) {
      console.log('ERROR: No se recibió ningún archivo');
      return res.status(400).json({
        success: false,
        message: 'No se subió ningún archivo. Usa campo "file".'
      });
    }

    console.log('Archivo recibido:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      key: req.file.key,
      location: req.file.location
    });

    res.status(200).json({
      success: true,
      message: 'Archivo subido exitosamente a S3',
      data: {
        fileUrl: req.file.location,
        fileName: req.file.key,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('FALLO CRÍTICO en upload:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al subir archivo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error del servidor'
    });
  }
});

// ============================================
// ELIMINAR ARCHIVO DE S3
// ============================================
router.delete('/', async (req, res) => {
  console.log('DELETE /api/upload → Request recibido');
  console.log('Body:', req.body);

  try {
    const { fileUrl } = req.body;

    if (!fileUrl || typeof fileUrl !== 'string') {
      console.log('ERROR: fileUrl faltante o inválido');
      return res.status(400).json({
        success: false,
        message: 'Se requiere "fileUrl" válido en el cuerpo'
      });
    }

    console.log('Eliminando de S3:', fileUrl);
    const result = await deleteFromS3(fileUrl);

    if (result.success) {
      console.log('Archivo eliminado de S3');
      return res.status(200).json({
        success: true,
        message: 'Archivo eliminado correctamente'
      });
    } else {
      console.log('Error de S3:', result.error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar de S3',
        error: result.error
      });
    }
  } catch (error) {
    console.error('FALLO CRÍTICO en delete:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al eliminar archivo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error del servidor'
    });
  }
});

// ============================================
// TEST DE CONEXIÓN
// ============================================
router.get('/test', (req, res) => {
  res.json({
    ok: true,
    message: 'Ruta /api/upload activa y funcional ✅'
  });
});

module.exports = router;
