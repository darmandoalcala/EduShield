import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Constants from "expo-constants";
import { Alert } from "react-native";

// --- Declaramos las variables "perezosamente" (lazy) ---
// No les damos valor todavía
let s3Client;
let BUCKET_NAME;
let REGION;

/**
 * Inicializa el cliente S3 la primera vez que se necesita.
 * Esto da tiempo a que Constants.expoConfig se cargue.
 */
const getS3Client = () => {
  // 1. Si ya lo creamos, solo lo devolvemos
  if (s3Client) {
    return s3Client;
  }

  // 2. Si es la primera vez, leemos los Constants AHORA
  // (En este punto, Constants.expoConfig ya está listo)
  
  REGION = Constants.expoConfig?.extra?.AWS_REGION;
  BUCKET_NAME = Constants.expoConfig?.extra?.S3_BUCKET_NAME;

  const S3_CONFIG = {
    region: REGION,
    credentials: {
      accessKeyId: Constants.expoConfig?.extra?.AWS_ACCESS_KEY_ID,
      secretAccessKey: Constants.expoConfig?.extra?.AWS_SECRET_ACCESS_KEY,
    },
  };

  // 3. Validamos
  if (!S3_CONFIG.region || !S3_CONFIG.credentials.accessKeyId || !S3_CONFIG.credentials.secretAccessKey || !BUCKET_NAME) {
    console.error("Error: Faltan variables de entorno de AWS S3.");
    // Este error SÍ es grave y significa que el build está mal
    throw new Error("Faltan variables de entorno de S3");
  }

  // 4. Creamos el cliente y lo guardamos
  console.log("Cliente S3 inicializado exitosamente.");
  s3Client = new S3Client(S3_CONFIG);
  return s3Client;
};

// --- Función de Carga ---
export const uploadImageToS3 = async (imageUri, folder = 'photos') => {
  try {
    // --- ¡CAMBIO CLAVE! ---
    // Obtenemos el cliente aquí, no de una variable global
    const client = getS3Client();

    // (El resto de tu lógica para convertir a ArrayBuffer es perfecta)
    const fileExtension = imageUri.split('.').pop().toLowerCase();
    const fileName = `${folder}/${Date.now()}.${fileExtension}`;
    
    let contentType = 'image/jpeg';
    if (fileExtension === 'png') contentType = 'image/png';
    if (fileExtension === 'gif') contentType = 'image/gif';
    
    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer();

    // Prepara el comando
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME, // Esta variable se llenó en getS3Client()
      Key: fileName,      
      Body: arrayBuffer,    
      ContentType: contentType, 
    });

    // Envía el comando
    await client.send(uploadCommand);

    // Construye la URL (Usamos la variable REGION)
    const imageUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
    
    console.log("¡Éxito! Imagen en:", imageUrl);
    return imageUrl;

  } catch (error) {
    // ... (Tu bloque catch para mostrar errores detallados)
    console.error("--- ERROR DETALLADO DE S3 ---");
    console.error("Nombre del Error:", error.name); 
    console.error("Mensaje del Error:", error.message); 
    console.error("Stack Completo:", error);
    console.error("--- FIN DEL ERROR ---");
    Alert.alert("Error de subida", `Error: ${error.name}. Revisa la consola.`);
    throw new Error("No se pudo subir la imagen.");
  }
};