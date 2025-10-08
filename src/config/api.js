// config/api.js

const isDevelopment = __DEV__;

const API_URLS = {
  // CODESPACE ⚠️CAMBIEN SEGUN SU CODESPACE (revisar en puertos, el 3001 y cambiar a público)⚠️
  development: 'https://stunning-spoon-4jjg6x9vjpvrfqqx6-3001.app.github.dev', //NO LLEVA BARRA FINAL
  
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
  }
};