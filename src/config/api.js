const isDevelopment = __DEV__;

const API_URLS = {
  // CODESPACE ⚠️CAMBIEN SEGUN SU CODESPACE (revisar en puertos, el 3001 y cambiar a público)⚠️
  development: 'https://silver-fiesta-x559xjqp5gxvc9p67-3001.app.github.dev',
  
  // PRODUU
  production: 'https://tu-api-produccion.com',
  
  // LOCALHOST
  local: 'http://localhost:3001',
};

// Exportar 
export const API_BASE_URL = API_URLS.development; // CAMBIAR SEGUN DONDE SE PRUEBA

//Exportar objeto para pruebas
export const ApiService = {
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
      console.log('📥 Respuesta raw:', textResponse);
      console.log('📊 Status:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido. Verifica que el backend esté corriendo.');
      }

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${data.error || 'Error en el registro'}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Error en registerUser:', error);
      
      if (error.message.includes('Network request failed')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo en Codespaces.');
      }
      
      throw error;
    }
  },

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
      console.log('📥 Respuesta raw:', textResponse);
      console.log('📊 Status:', response.status);

      let data;
      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error('El servidor no devolvió un JSON válido');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en loginUser:', error);
      
      if (error.message.includes('Network request failed')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
      }
      
      throw error;
    }
  },

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

      return data;
    } catch (error) {
      console.error('❌ Error en getUserProfile:', error);
      throw error;
    }
  },

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

      return data;
    } catch (error) {
      console.error('❌ Error en updateUserProfile:', error);
      throw error;
    }
  }
};