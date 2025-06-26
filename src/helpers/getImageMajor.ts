import { getImage } from "../api/apiImages";

export const LoadImageMajor = async (id_articulo: number) => {
    const response = await getImage(id_articulo);
    return response.data.results; // Devuelve todas las imagen del articulo
};

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: getImageMajor.ts
 * Ruta: 
 * Tamaño: 238 bytes
 * Líneas totales:        6
 * Líneas no vacías: 5
 * Caracteres:      238
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { getImage } from "../api/apiImages";
 * 
 * 📤 EXPORTS:
 *   - export const LoadImageMajor = async (id_articulo: number) => {
 * 
 * ⚡ FUNCIONES:
 *   - export const LoadImageMajor = async (id_articulo: number) => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - export const LoadImageMajor = async (id_articulo: number) => {
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 1
 *   - Ratio código/comentarios: 5.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
