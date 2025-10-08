const ibmdb = require('ibm_db');

// Configuración de conexión a DB2 (con tus datos reales)
const DB_CONFIG = {
  DATABASE: 'bludb',
  HOSTNAME: 'b0aebb68-94fa-46ec-a1fc-1c999edb6187.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud',
  PORT: '31249',
  PROTOCOL: 'TCPIP',
  UID: 'vjn37341',
  PWD: 'BqHmhrRDv3cYkT4q'
};

// String de conexión
const connectionString = `DATABASE=${DB_CONFIG.DATABASE};HOSTNAME=${DB_CONFIG.HOSTNAME};PORT=${DB_CONFIG.PORT};PROTOCOL=${DB_CONFIG.PROTOCOL};UID=${DB_CONFIG.UID};PWD=${DB_CONFIG.PWD};Security=SSL;`;

class Database {
  static async connect() {
    try {
      console.log('Conectando a DB2...');
      const connection = await ibmdb.open(connectionString);
      console.log('Conexión a DB2 exitosa');
      return connection;
    } catch (error) {
      console.error('Error conectando a DB2:', error);
      throw error;
    }
  }

  static async query(sql, params = []) {
    let connection;
    try {
      connection = await this.connect();
      console.log('Ejecutando query:', sql);
      const result = await connection.query(sql, params);
      await connection.close();
      return result;
    } catch (error) {
      console.error('Error en query:', error);
      if (connection) {
        await connection.close();
      }
      throw error;
    }
  }

  // Método específico para insertar usuarios
  static async insertUser(userData) {
    const sql = `
      INSERT INTO usuario (
        codigo_estudiante, nombre, apellido, email, password, 
        telefono, sexo, foto_perfil, rol_id, centro_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    return await this.query(sql, [
      userData.codigo_estudiante,
      userData.nombre,
      userData.apellido,
      userData.email,
      userData.password,
      userData.telefono || null,
      userData.sexo || null,
      userData.foto_perfil || null,
      userData.rol_id || 1, // 1 = estudiante por defecto
      userData.centro_id || 1 // 1 = CUCEI por defecto
    ]);
  }

  // Método para buscar usuario por email
  static async findUserByEmail(email) {
    const sql = `SELECT * FROM usuario WHERE email = ?`;
    const result = await this.query(sql, [email]);
    return result.length > 0 ? result[0] : null;
  }

  //Método para buscar usuario por código de estudiante
  static async findUserByCodigoEstudiante(codigoEstudiante) {
    try {
      const query = `
        SELECT * FROM USUARIOS 
        WHERE CODIGO_ESTUDIANTE = ?
      `;
      
      const result = await this.executeQuery(query, [codigoEstudiante]);
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error buscando usuario por código:', error);
      throw error;
    }
  }
}

module.exports = Database;