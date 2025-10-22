// config/api.js

const isDevelopment = __DEV__;

const API_URLS = {
  // CODESPACE ⚠️CAMBIEN SEGUN SU CODESPACE (revisar en puertos, el 3001 y cambiar a público)⚠️
<<<<<<< HEAD
  development: 'https://symmetrical-acorn-45pj6px5rr9hqvwv-3001.app.github.dev', //NO LLEVA BARRA FINAL
=======
  development: 'https://literate-cod-4jj5vrppq4x43w97-3001.app.github.dev',
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
  
  // PRODUCCIÓN
  production: 'https://tu-api-produccion.com',
  
  // LOCALHOST
  local: 'http://localhost:3001',
};

// Exportar 
export const API_BASE_URL = API_URLS.development; // CAMBIAR SEGUN DONDE SE PRUEBA

// Exportar objeto para pruebas
export const ApiService = {
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

  // REGISTRO DE USUARIO
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

  // LOGIN DE USUARIO
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
      console.log('📥 Respuesta raw del servidor:', textResponse);
      console.log('📊 Status code:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido');
      }

      console.log('✅ Datos parseados completos:', JSON.stringify(data, null, 2)); // 👈 VER TODO

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas');
      }

<<<<<<< HEAD
      return {
        success: true,
        data: data.user || data.data || data,
        token: data.token,
      };
=======
      return data;
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
    } catch (error) {
      console.error('❌ Error en loginUser:', error);
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

<<<<<<< HEAD
  // ==========================================
  // MÉTODOS DE REPORTES
  // ==========================================

async createReport(reportData) {
    try {
      console.log('🚀 Enviando reporte:', reportData);
      console.log('🌐 URL del servidor:', API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
=======
  // FUNCIONES DE CONTACTOS PERSONALES
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
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
<<<<<<< HEAD
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
=======
        body: JSON.stringify(contactData),
      });

      const textResponse = await response.text();
      let data;
      
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('❌ Error en updateReportStatus:', error);
=======
        throw new Error(data.message || 'Error al agregar contacto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en addPersonalContact:', error);
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
      throw error;
    }
  },

<<<<<<< HEAD
  async deleteReport(reportId) {
    try {
      console.log('🗑️ Eliminando reporte:', reportId);
      console.log('🌐 URL:', `${API_BASE_URL}/api/reports/${reportId}`);

      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
=======
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
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();
<<<<<<< HEAD
      console.log('📥 Respuesta eliminación:', textResponse);

      let data;
=======
      let data;
      
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        throw new Error('Error al procesar la respuesta');
      }

      if (!response.ok) {
<<<<<<< HEAD
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
=======
        throw new Error(data.message || 'Error al eliminar contacto');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en deletePersonalContact:', error);
      throw error;
    }
  }
>>>>>>> 7a669fb322f00c78599410db7613fd9cfd5787b7
};