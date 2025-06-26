export const truncateString = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

export const hash = (str: string) =>
  str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: strings.ts
 * Ruta: 
 * Tamaño: 291 bytes
 * Líneas totales:        8
 * Líneas no vacías: 8
 * Caracteres:      291
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📤 EXPORTS:
 *   - export const hash = (str: string) =>
 *   - export const truncateString = (text: string, maxLength: number): string => {
 * 
 * ⚡ FUNCIONES:
 *   - export const hash = (str: string) =>()
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 4
 *   - Ratio código/comentarios: 8.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
