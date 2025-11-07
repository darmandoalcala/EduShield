import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Constants from "expo-constants";
import { Alert } from "react-native";

// --- Configuración ---

// 1. Lee las variables de entorno que pusiste en eas.json
// OJO: La ruta es un poco larga para acceder a 'env'
const S3_CONFIG = {
  region: "us-east-2",
  credentials: {
    accessKeyId: "AKIA5KC7RPKPI3VAT2NU",
    secretAccessKey: "AKIA5KC7RPKPI3VAT2NU",
  },
};

// 2. Obtén el nombre del bucket
const BUCKET_NAME = "edushield-s3-image-storage";

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
    // 5. Genera un nombre de archivo único y adivina el ContentType
    const fileExtension = imageUri.split('.').pop().toLowerCase();
    const fileName = `${folder}/${Date.now()}.${fileExtension}`;
    
    let contentType = 'image/jpeg'; // Default
    if (fileExtension === 'png') {
      contentType = 'image/png';
    } else if (fileExtension === 'gif') {
      contentType = 'image/gif';
    }
    
    // 6. Convierte la imagen (URI local) en un "ArrayBuffer" (datos binarios)
    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer(); // <-- ¡CAMBIO 1!

    // 7. Prepara el comando de subida
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,      
      Body: arrayBuffer,    // <-- ¡CAMBIO 2! (Ahora es ArrayBuffer)
      ContentType: contentType, // <-- ¡CAMBIO 3! (Tipo adivinado)
      ACL: 'public-read', 
    });

    // 8. Envía el comando al bucket de S3
    await s3Client.send(uploadCommand);

    // 9. Construye y devuelve la URL pública
    const imageUrl = `https://${BUCKET_NAME}.s3.${S3_CONFIG.region}.amazonaws.com/${fileName}`;
    
    console.log("¡Éxito! Imagen en:", imageUrl);
    return imageUrl;

  } catch (error) {
    // --- ¡ESTE ES EL CAMBIO IMPORTANTE! ---
    // Esto nos dará el error específico de S3 (ej. AccessDenied, NoSuchBucket)
    console.error("--- ERROR DETALLADO DE S3 ---");
    console.error("Nombre del Error:", error.name); 
    console.error("Mensaje del Error:", error.message); 
    console.error("Stack Completo:", error);
    console.error("--- FIN DEL ERROR ---");
    // ----------------------------------------
    
    // Mostramos el nombre del error en la alerta para depurar más rápido
    Alert.alert("Error de subida", `Error: ${error.name}. Revisa la consola.`);
    throw new Error("No se pudo subir la imagen.");
  }
};