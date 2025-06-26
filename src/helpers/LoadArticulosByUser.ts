import { getArticulosByUsuario } from "../api/apiArticulos";


export const LoadArticulosByUser = async (id_usuario: number) => {
    const response = await getArticulosByUsuario(id_usuario);
    return response.data.results; // Devuelver todos los artículos del usuario
};
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: LoadArticulosByUser.ts
 * Ruta: 
 * Tamaño: 274 bytes
 * Líneas totales:        6
 * Líneas no vacías: 5
 * Caracteres:      274
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { getArticulosByUsuario } from "../api/apiArticulos";
 * 
 * 📤 EXPORTS:
 *   - export const LoadArticulosByUser = async (id_usuario: number) => {
 * 
 * ⚡ FUNCIONES:
 *   - export const LoadArticulosByUser = async (id_usuario: number) => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - export const LoadArticulosByUser = async (id_usuario: number) => {
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
