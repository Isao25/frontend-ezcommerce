import { getEtiquetas } from "../api/apiEtiquetas";

export const LoadEtiquetas = async () => {
    const response = await getEtiquetas();
    return response.data.results.map((etiqueta: { id: number; nombre: string }) => ({
      id: etiqueta.id,
      nombre: etiqueta.nombre,
    }));
  }; 
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: LoadEtiquetas.ts
 * Ruta: 
 * Tamaño: 293 bytes
 * Líneas totales:        8
 * Líneas no vacías: 8
 * Caracteres:      293
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { getEtiquetas } from "../api/apiEtiquetas";
 * 
 * 📤 EXPORTS:
 *   - export const LoadEtiquetas = async () => {
 * 
 * ⚡ FUNCIONES:
 *   - export const LoadEtiquetas = async () => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - export const LoadEtiquetas = async () => {
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 2
 *   - Ratio código/comentarios: 8.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
