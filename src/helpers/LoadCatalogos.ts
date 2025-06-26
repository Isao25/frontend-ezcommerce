import { getCatalogoUser } from "../api/apiCatalogos";


export const LoadCatalogos = async (id_usuario: number) => {
    const response = await getCatalogoUser(id_usuario);
    return response.data.results; // Devuelve el primer catálogo porque se asume que el usuario solo tiene un catálogo
};
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: LoadCatalogos.ts
 * Ruta: 
 * Tamaño: 297 bytes
 * Líneas totales:        6
 * Líneas no vacías: 5
 * Caracteres:      297
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { getCatalogoUser } from "../api/apiCatalogos";
 * 
 * 📤 EXPORTS:
 *   - export const LoadCatalogos = async (id_usuario: number) => {
 * 
 * ⚡ FUNCIONES:
 *   - export const LoadCatalogos = async (id_usuario: number) => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - export const LoadCatalogos = async (id_usuario: number) => {
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
