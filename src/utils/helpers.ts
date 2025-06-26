import {ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {storage} from "../services/firebase";
import {v4} from "uuid";

export async function getFileURL(elemFile:File, storageDirec:string) {
  if (!elemFile) return null;

  try {
    const shortUUID = v4().split('-')[0]
    const fileRef = ref(storage, `${storageDirec}/${elemFile.name}-${shortUUID}`);
    await uploadBytes(fileRef, elemFile);
    const fileURL = await getDownloadURL(fileRef);
    return fileURL;
  } catch (error) {
    console.error("Error subiendo el archivo o obteniendo la URL:", error);
    return null;
  }
}

export async function deleteFileFromFirebase(fileURL: string) {
  try {
    const fileRef = ref(storage, fileURL);
    await deleteObject(fileRef); // Eliminar archivo
  } catch (error) {
    console.error("Error eliminando el archivo:", error);
  }
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: helpers.ts
 * Ruta: 
 * Tamaño: 872 bytes
 * Líneas totales:       26
 * Líneas no vacías: 24
 * Caracteres:      872
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - {ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
 *   - {storage} from "../services/firebase";
 *   - {v4} from "uuid";
 * 
 * ⚡ FUNCIONES:
 *   - export async function deleteFileFromFirebase(fileURL: string) {()
 *   - export async function getFileURL(elemFile:File, storageDirec:string) {()
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Try-catch blocks: 2
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 3
 *   - Ratio código/comentarios: 24.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
