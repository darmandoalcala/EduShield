import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Constants from "expo-constants";
import { Alert } from "react-native";

// --- Declaramos las variables "perezosamente" (lazy) ---
let s3Client;
let BUCKET_NAME;
let REGION;

/**
 * Inicializa el cliente S3 la primera vez que se necesita.
 */
const getS3Client = () => {
  if (s3Client) {
    return s3Client;
  }

  REGION = Constants.expoConfig?.extra?.AWS_REGION;
  BUCKET_NAME = Constants.expoConfig?.extra?.S3_BUCKET_NAME;

  const S3_CONFIG = {
    region: REGION,
    credentials: {
      accessKeyId: Constants.expoConfig?.extra?.AWS_ACCESS_KEY_ID,
      secretAccessKey: Constants.expoConfig?.extra?.AWS_SECRET_ACCESS_KEY,
    },
  };

  if (!S3_CONFIG.region || !S3_CONFIG.credentials.accessKeyId || !S3_CONFIG.credentials.secretAccessKey || !BUCKET_NAME) {
    console.error("Error: Faltan variables de entorno de AWS S3.");
    throw new Error("Faltan variables de entorno de S3");
  }

  console.log("Cliente S3 inicializado exitosamente.");
  s3Client = new S3Client(S3_CONFIG);
  return s3Client;
};

/**
 * Sube una imagen a S3
 * @param {string} imageUri - URI local de la imagen
 * @param {string} folder - Carpeta destino en S3
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadImageToS3 = async (imageUri, folder = 'photos') => {
  try {
    const client = getS3Client();

    const fileExtension = imageUri.split('.').pop().toLowerCase();
    const fileName = `${folder}/${Date.now()}.${fileExtension}`;
    
    let contentType = 'image/jpeg';
    if (fileExtension === 'png') contentType = 'image/png';
    if (fileExtension === 'gif') contentType = 'image/gif';
    
    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer();

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,      
      Body: arrayBuffer,    
      ContentType: contentType, 
    });

    await client.send(uploadCommand);

    const imageUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
    
    console.log("¡Éxito! Imagen en:", imageUrl);
    return imageUrl;

  } catch (error) {
    console.error("--- ERROR DETALLADO DE S3 (IMAGEN) ---");
    console.error("Nombre del Error:", error.name); 
    console.error("Mensaje del Error:", error.message); 
    console.error("Stack Completo:", error);
    console.error("--- FIN DEL ERROR ---");
    Alert.alert("Error de subida", `Error: ${error.name}. Revisa la consola.`);
    throw new Error("No se pudo subir la imagen.");
  }
};

/**
 * Sube un video a S3
 * @param {string} videoUri - URI local del video
 * @param {string} folder - Carpeta destino en S3
 * @returns {Promise<string>} URL pública del video
 */
export const uploadVideoToS3 = async (videoUri, folder = 'videos') => {
  try {
    const client = getS3Client();

    const fileExtension = videoUri.split('.').pop().toLowerCase();
    const fileName = `${folder}/${Date.now()}.${fileExtension}`;
    
    // Detectar el tipo de contenido según la extensión
    let contentType = 'video/mp4';
    if (fileExtension === 'mov') contentType = 'video/quicktime';
    if (fileExtension === 'avi') contentType = 'video/x-msvideo';
    if (fileExtension === 'webm') contentType = 'video/webm';
    if (fileExtension === 'mkv') contentType = 'video/x-matroska';
    
    console.log(`📹 Subiendo video (${fileExtension}) a S3...`);
    
    const response = await fetch(videoUri);
    const arrayBuffer = await response.arrayBuffer();

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,      
      Body: arrayBuffer,    
      ContentType: contentType, 
    });

    await client.send(uploadCommand);

    const videoUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
    
    console.log("¡Éxito! Video en:", videoUrl);
    return videoUrl;

  } catch (error) {
    console.error("--- ERROR DETALLADO DE S3 (VIDEO) ---");
    console.error("Nombre del Error:", error.name); 
    console.error("Mensaje del Error:", error.message); 
    console.error("Stack Completo:", error);
    console.error("--- FIN DEL ERROR ---");
    Alert.alert("Error de subida", `Error subiendo video: ${error.name}. Revisa la consola.`);
    throw new Error("No se pudo subir el video.");
  }
};

/**
 * Función genérica para subir archivos (imágenes o videos)
 * Detecta automáticamente el tipo de archivo
 * @param {string} fileUri - URI local del archivo
 * @param {string} folder - Carpeta destino en S3
 * @returns {Promise<string>} URL pública del archivo
 */
export const uploadFileToS3 = async (fileUri, folder = 'media') => {
  const fileExtension = fileUri.split('.').pop().toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
  
  if (imageExtensions.includes(fileExtension)) {
    return await uploadImageToS3(fileUri, folder);
  } else if (videoExtensions.includes(fileExtension)) {
    return await uploadVideoToS3(fileUri, folder);
  } else {
    throw new Error(`Tipo de archivo no soportado: ${fileExtension}`);
  }
};