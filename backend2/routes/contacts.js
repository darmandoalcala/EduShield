const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Tu conexión DB2

// 📋 GET - Obtener todos los contactos de un usuario
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('📋 Obteniendo contactos del usuario:', userId);

    const result = await pool.query(
      'SELECT id, nombre, telefono, relacion, codigo_estudiante, centro_id, color FROM CONTACTOS WHERE codigo_estudiante = ? ORDER BY id DESC',
      [userId]
    );

    // 👇 NORMALIZAR los nombres de columnas a minúsculas
    const contactosNormalizados = result.map(contacto => ({
      id: contacto.ID,
      nombre: contacto.NOMBRE,
      telefono: contacto.TELEFONO,
      relacion: contacto.RELACION,
      codigo_estudiante: contacto.CODIGO_ESTUDIANTE,
      centro_id: contacto.CENTRO_ID,
      color: contacto.COLOR
    }));

    res.json({
      success: true,
      data: contactosNormalizados,
      message: 'Contactos obtenidos correctamente'
    });
  } catch (error) {
    console.error('❌ Error obteniendo contactos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
      error: error.message
    });
  }
});

// ➕ POST - Crear un nuevo contacto
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { nombre, telefono, relacion, color } = req.body;

    console.log('➕ Creando contacto para usuario:', userId);
    console.log('Datos:', { nombre, telefono, relacion, color });

    // Validaciones
    if (!nombre || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y teléfono son obligatorios'
      });
    }

    if (!/^[0-9]{10}$/.test(telefono)) {
      return res.status(400).json({
        success: false,
        message: 'El teléfono debe tener 10 dígitos'
      });
    }

    // OBTENER EL CENTRO_ID del usuario
    const usuario = await pool.query(
      'SELECT centro_id FROM USUARIO WHERE codigo_estudiante = ?',
      [userId]
    );

    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado. Verifica el código de estudiante.'
      });
    }

    const centroId = usuario[0].CENTRO_ID;
    console.log('🏫 Centro ID del usuario:', centroId);

    // Insertar contacto
    await pool.query(
      `INSERT INTO CONTACTOS (codigo_estudiante, nombre, telefono, relacion, centro_id, color) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, nombre, telefono, relacion || 'Familiar', centroId, color || '#FF0000']
    );

    console.log('✅ Contacto insertado correctamente');

    // Obtener el contacto recién creado
    const newContact = await pool.query(
      'SELECT id, nombre, telefono, relacion, codigo_estudiante, centro_id, color FROM CONTACTOS WHERE codigo_estudiante = ? ORDER BY id DESC FETCH FIRST 1 ROW ONLY',
      [userId]
    );

    const contactoNormalizado = {
      id: newContact[0].ID,
      nombre: newContact[0].NOMBRE,
      telefono: newContact[0].TELEFONO,
      relacion: newContact[0].RELACION,
      codigo_estudiante: newContact[0].CODIGO_ESTUDIANTE,
      centro_id: newContact[0].CENTRO_ID,
      color: newContact[0].COLOR
    };

    res.status(201).json({
      success: true,
      data: contactoNormalizado,
      message: 'Contacto creado correctamente'
    });
  } catch (error) {
    console.error('❌ Error creando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el contacto',
      error: error.message
    });
  }
});

// ✏️ PUT - Actualizar un contacto
router.put('/contact/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const { nombre, telefono, relacion, color } = req.body;

    console.log('✏️ Actualizando contacto:', contactId);

    // Validaciones
    if (!nombre || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y teléfono son obligatorios'
      });
    }

    if (!/^[0-9]{10}$/.test(telefono)) {
      return res.status(400).json({
        success: false,
        message: 'El teléfono debe tener 10 dígitos'
      });
    }

    // DB2 usa ?
    await pool.query(
      `UPDATE CONTACTOS 
       SET nombre = ?, telefono = ?, relacion = ?, color = ?
       WHERE id = ?`,
      [nombre, telefono, relacion || 'Familiar', color || '#FF0000', contactId]
    );

    // Obtener el contacto actualizado
    const updatedContact = await pool.query(
      'SELECT * FROM CONTACTOS WHERE id = ?',
      [contactId]
    );

    if (updatedContact.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    const contactoNormalizado = {
      id: updatedContact[0].ID,
      nombre: updatedContact[0].NOMBRE,
      telefono: updatedContact[0].TELEFONO,
      relacion: updatedContact[0].RELACION,
      codigo_estudiante: updatedContact[0].CODIGO_ESTUDIANTE,
      centro_id: updatedContact[0].CENTRO_ID,
      color: updatedContact[0].COLOR
    };

    res.json({
      success: true,
      data: contactoNormalizado,
      message: 'Contacto actualizado correctamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
      error: error.message
    });
  }
});

// 🗑️ DELETE - Eliminar un contacto
router.delete('/contact/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    console.log('🗑️ Eliminando contacto:', contactId);

    // Primero obtener el contacto antes de eliminarlo
    const contact = await pool.query(
      'SELECT * FROM CONTACTOS WHERE id = ?',
      [contactId]
    );

    if (contact.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    // Eliminar
    await pool.query(
      'DELETE FROM CONTACTOS WHERE id = ?',
      [contactId]
    );

    res.json({
      success: true,
      data: contact[0],
      message: 'Contacto eliminado correctamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
      error: error.message
    });
  }
});

module.exports = router;