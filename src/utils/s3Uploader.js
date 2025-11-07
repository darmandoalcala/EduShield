import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Constants from "expo-constants";
import { Alert } from "react-native";

// --- Configuración ---

// 1. Lee las variables de entorno que pusiste en eas.json
// OJO: La ruta es un poco larga para acceder a 'env'
const S3_CONFIG = {
  region: Constants.expoConfig?.extra?.eas?.env?.AWS_REGION,
  credentials: {
    accessKeyId: Constants.expoConfig?.extra?.eas?.env?.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.expoConfig?.extra?.eas?.env?.AWS_SECRET_ACCESS_KEY,
  },
};

// 2. Obtén el nombre del bucket
const BUCKET_NAME = Constants.expoConfig?.extra?.eas?.env?.S3_BUCKET_NAME;

// 3. Valida que las variables existan (¡importante para depurar!)
if (!S3_CONFIG.region || !S3_CONFIG.credentials.accessKeyId || !S3_CONFIG.credentials.secretAccessKey || !BUCKET_NAME) {
  console.error("Error: Faltan variables de entorno de AWS S3.");
  // Si estás en desarrollo, puedes mostrar una alerta
  // Alert.alert("Error de Configuración", "Faltan variables de S3. La app debe recompilarse.");
}

// 4. Crea una instancia "reutilizable" del cliente S3
// Solo la creamos una vez para que sea eficiente
const s3Client = new S3Client(S3_CONFIG);

// --- Función de Carga ---

/**
 * Sube una imagen a S3 y devuelve la URL pública
 * @param {string} imageUri La URI local de la imagen (ej. 'file://...')
 * @param {string} folder Carpeta destino (ej. 'profiles' o 'reports')
 * @returns {Promise<string>} La URL pública de la imagen en S3
 */
export const uploadImageToS3 = async (imageUri, folder = 'photos') => {
  try {
    // 5. Convierte la imagen (URI local) en un "Blob" (datos binarios)
    // fetch funciona con URIs locales 'file://' en React Native
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 6. Genera un nombre de archivo único
    const fileExtension = imageUri.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExtension}`;

    // 7. Prepara el comando de subida
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,      // El nombre del archivo en S3 (ej. "profiles/123456789.jpg")
      Body: blob,         // Los datos de la imagen
      ContentType: blob.type, // ej. 'image/jpeg'
      ACL: 'public-read', // ¡Importante! Hace el archivo visible públicamente
    });

    // 8. Envía el comando al bucket de S3
    await s3Client.send(uploadCommand);

    // 9. Construye y devuelve la URL pública
    const imageUrl = `https://${BUCKET_NAME}.s3.${S3_CONFIG.region}.amazonaws.com/${fileName}`;
    
    console.log("¡Éxito! Imagen en:", imageUrl);
    return imageUrl;

  } catch (error) {
    console.error("Error al subir la imagen a S3:", error);
    Alert.alert("Error de subida", "No se pudo subir la imagen. Revisa la consola.");
    // Relanzamos el error para que la pantalla que lo llamó sepa que falló
    throw new Error("No se pudo subir la imagen.");
  }
};