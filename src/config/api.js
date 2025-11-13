// config/api.js

const isDevelopment = __DEV__;

const API_URLS = {
  // CODESPACE ⚠️CAMBIEN SEGUN SU CODESPACE (revisar en puertos, el 3001 y cambiar a público)⚠️
    development: "https://opulent-potato-5gg45wprgw7w3pxgx-3001.app.github.dev", //NO LLEVA BARRA FINAL
    //development: "http://edushield.duckdns.org:3001", //NO LLEVA BARRA FINAL

  // PRODUCCIÓN
  production: 'https://tu-api-produccion.com',
  
  // LOCALHOST
  local: 'http://localhost:3001',
};

// Exportar 
export const API_BASE_URL = API_URLS.development; // CAMBIAR SEGUN DONDE SE PRUEBA

// Exportar objeto para pruebas
export const ApiService = {

  // ==========================================
  // FUNCIONES DE REGISTRO DE USUARIO
  // ==========================================

  // VERIFICAR SI EMAIL YA EXISTE
  async checkEmailExists(email) {
    try {
      console.log('🔍 Verificando si el email existe:', email);

      const response = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta verificación email:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        return { exists: false, message: 'Error al verificar el correo' };
      }

      return {
        exists: data.exists || false,
        message: data.message || '',
      };
    } catch (error) {
      console.error('❌ Error en checkEmailExists:', error);
      return { exists: false, message: 'Error de conexión' };
    }
  },

  // Registro de usuario
  async registerUser(userData) {
    try {
      console.log('🚀 Enviando datos de registro:', userData);
      console.log('🌐 URL del servidor:', API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta raw del registro:', textResponse);
      console.log('📊 Status del registro:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido. Verifica que el backend esté corriendo.');
      }

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 409) {
          // Conflicto - dato duplicado
          throw new Error(data.message || 'Ya existe una cuenta con estos datos');
        } else if (response.status === 400) {
          // Bad request - datos inválidos
          throw new Error(data.message || 'Datos inválidos. Verifica la información.');
        }
        throw new Error(data.message || `Error ${response.status}: ${data.error || 'Error en el registro'}`);
      }

      return {
        success: true,
        data: data.user || data.data || data,
        token: data.token,
      };
    } catch (error) {
      console.error('❌ Error en registerUser:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo en Codespaces.');
      }
      
      throw error;
    }
  },

  // ==========================================
  // LOGIN DE USUARIO
  // ==========================================

  async loginUser(credentials) {
    try {
      console.log('🚀 Enviando credenciales de login:', { email: credentials.email });
      console.log('🌐 URL del servidor:', API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta raw del login:', textResponse);
      console.log('📊 Status del login:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido');
      }

      if (!response.ok) {
        // Manejar errores específicos de login
        if (response.status === 401) {
          throw new Error('Credenciales inválidas');
        } else if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        }
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      return {
        success: true,
        data: data.user || data.data || data,
        token: data.token,
      };
    } catch (error) {
      console.error('❌ Error en loginUser:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
      }
      
      throw error;
    }
  },

  // OBTENER PERFIL DE USUARIO
  async getUserProfile(userId) {
    try {
      console.log('🔍 Obteniendo perfil del usuario:', userId);

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta perfil:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('Error al obtener los datos del perfil');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar el perfil');
      }

      return {
        success: true,
        data: data.user || data.data || data,
      };
    } catch (error) {
      console.error('❌ Error en getUserProfile:', error);
      throw error;
    }
  },

  // ACTUALIZAR PERFIL DE USUARIO
  async updateUserProfile(userId, userData) {
    try {
      console.log('💾 Actualizando perfil del usuario:', userId, userData);

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta actualización:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      return {
        success: true,
        data: data.user || data.data || data,
      };
    } catch (error) {
      console.error('❌ Error en updateUserProfile:', error);
      throw error;
    }
  },

    // ==========================================
    // ELIMINAR CUENTA DE USUARIO
    // ==========================================
    async deleteAccount(userId, reason) {
      try {
        console.log('🗑️ Eliminando cuenta del usuario:', userId, reason);

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ reason }),
        });

        const textResponse = await response.text();
        console.log('📥 Respuesta eliminación cuenta:', textResponse);

        let data;
        try {
          data = textResponse ? JSON.parse(textResponse) : {};
        } catch (parseError) {
          console.error('❌ Error parseando JSON:', parseError);
          throw new Error('Error al procesar la respuesta del servidor');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error al eliminar la cuenta');
        }

        return {
          success: true,
          message: data.message || 'Cuenta eliminada correctamente',
        };
      } catch (error) {
        console.error('❌ Error en deleteAccount:', error);
        throw error;
      }
    },

  // ==========================================
  // MÉTODOS DE REPORTES
   // ==========================================

async createReport(reportData) {
    try {
      console.log('🚀 Enviando reporte:', reportData);
      console.log('🌐 URL del servidor:', API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta raw del reporte:', textResponse);
      console.log('📊 Status del reporte:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el reporte');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('❌ Error en createReport:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
      }
      
      throw error;
    }
  },

  async getUserReports(codigoEstudiante) {
    try {
      console.log('🔍 Obteniendo reportes del usuario:', codigoEstudiante);

      const response = await fetch(`${API_BASE_URL}/api/reports/user/${codigoEstudiante}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta reportes usuario:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('Error al obtener los reportes');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar los reportes');
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error) {
      console.error('❌ Error en getUserReports:', error);
      throw error;
    }
  },

  async getAllReports() {
    try {
      console.log('🔍 Obteniendo todos los reportes');

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta todos los reportes:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al obtener los reportes');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar los reportes');
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error) {
      console.error('❌ Error en getAllReports:', error);
      throw error;
    }
  },

  async getReportById(reportId) {
    try {
      console.log('🔍 Obteniendo reporte con ID:', reportId);
      console.log('🌐 URL:', `${API_BASE_URL}/api/reports/${reportId}`);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta reporte:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al obtener el reporte');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar el reporte');
      }

      return data.data || data;
    } catch (error) {
      console.error('❌ Error en getReportById:', error);
      throw error;
    }
  },

  async updateReportStatus(reportId, estado) {
    try {
      console.log('💾 Actualizando estado del reporte:', reportId, estado);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estado }),
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta actualización estado:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('❌ Error en updateReportStatus:', error);
      throw error;
    }
  },

  async deleteReport(reportId) {
    try {
      console.log('🗑️ Eliminando reporte:', reportId);
      console.log('🌐 URL:', `${API_BASE_URL}/api/reports/${reportId}`);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta eliminación:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el reporte');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('❌ Error en deleteReport:', error);
      throw error;
    }
  },

  async getReportsByCenter(centroId) {
    try {
      console.log('🔍 Obteniendo reportes del centro:', centroId);

      const response = await fetch(`${API_BASE_URL}/api/reports/center/${centroId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta reportes centro:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al obtener los reportes');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar los reportes');
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error) {
      console.error('❌ Error en getReportsByCenter:', error);
      throw error;
    }
  },

  async getReportStats() {
    try {
      console.log('📊 Obteniendo estadísticas de reportes');

      const response = await fetch(`${API_BASE_URL}/api/reports/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta estadísticas:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al obtener las estadísticas');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar las estadísticas');
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('❌ Error en getReportStats:', error);
      throw error;
    }
  },

  async deleteAllUserReports(codigoEstudiante) {
    try {
      console.log('🗑️ Eliminando todos los reportes del usuario:', codigoEstudiante);
      
      const response = await fetch(`${API_BASE_URL}/api/reports/user/${codigoEstudiante}/all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta raw eliminación múltiple:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }

      if (!response.ok) {
        throw new Error(data.message || `Error del servidor: ${response.status}`);
      }

      console.log('✅ Reportes eliminados exitosamente');

      return {
        success: true,
        message: data.message || 'Reportes eliminados correctamente',
        data: data.data || null,
      };
    } catch (error) {
      console.error('❌ Error en deleteAllUserReports:', error);
      throw error;
    }
  },

  // ==========================================
  // FUNCIONES DE CONTACTOS PERSONALES
  // ==========================================

  async getPersonalContacts(userId) {
    try {
      console.log('📋 Obteniendo contactos personales del usuario:', userId);

      const response = await fetch(`${API_BASE_URL}/api/contacts/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('📥 Respuesta contactos:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('Error al obtener los contactos');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar contactos');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en getPersonalContacts:', error);
      throw error;
    }
  },

  async addPersonalContact(userId, contactData) {
    try {
      console.log('➕ Agregando contacto:', contactData);

      const response = await fetch(`${API_BASE_URL}/api/contacts/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const textResponse = await response.text();
      let data;
      
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar contacto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en addPersonalContact:', error);
      throw error;
    }
  },

  async updatePersonalContact(contactId, contactData) {
    try {
      console.log('✏️ Actualizando contacto:', contactId);

      const response = await fetch(`${API_BASE_URL}/api/contacts/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const textResponse = await response.text();
      let data;
      
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar contacto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en updatePersonalContact:', error);
      throw error;
    }
  },

  async deletePersonalContact(contactId) {
    try {
      console.log('🗑️ Eliminando contacto:', contactId);

      const response = await fetch(`${API_BASE_URL}/api/contacts/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
      let data;
      
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar contacto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en deletePersonalContact:', error);
      throw error;
    }
  },

// Funciones de upload de archivos
  
  async uploadEvidence(fileUri, fileType) {
    try {
      console.log('Subiendo evidencia:', fileUri);

      const formData = new FormData();

      // Extraer extensión
      const uriParts = fileUri.split('.');
      const fileExtension = uriParts[uriParts.length - 1] || 'jpg';

      formData.append('file', {
        uri: fileUri,
        type: fileType || 'image/jpeg',
        name: `evidence-${Date.now()}.${fileExtension}`,
      });

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        // SIN HEADERS → deja que FormData lo maneje
      });

      const textResponse = await response.text();
      console.log('Respuesta upload:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al subir archivo');
      }

      return data;
    } catch (error) {
      console.error('Error en uploadEvidence:', error);
      throw error;
    }
  },

  async deleteEvidence(fileUrl) {
    try {
      console.log('Eliminando archivo:', fileUrl);
      
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ fileUrl }),
      });

      const textResponse = await response.text();
      console.log('Respuesta eliminacion:', textResponse);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar respuesta');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar archivo');
      }

      return data;
    } catch (error) {
      console.error('Error en deleteEvidence:', error);
      throw error;
    }
  },

};

export default ApiService;