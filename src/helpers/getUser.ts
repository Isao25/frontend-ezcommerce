import { getUsuarios } from "../api/apiUsuarios";

export const LoadUsuarios = async (userId: number) => {
    const response = await getUsuarios(userId);
    return response.data;
};
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: getUser.ts
 * Ruta: 
 * Tamaño: 183 bytes
 * Líneas totales:        5
 * Líneas no vacías: 5
 * Caracteres:      183
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { getUsuarios } from "../api/apiUsuarios";
 * 
 * 📤 EXPORTS:
 *   - export const LoadUsuarios = async (userId: number) => {
 * 
 * ⚡ FUNCIONES:
 *   - export const LoadUsuarios = async (userId: number) => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - export const LoadUsuarios = async (userId: number) => {
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
