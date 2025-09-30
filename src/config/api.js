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

      //Obtener texto  para debugging
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
  }
};