import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: utils.ts
 * Ruta: 
 * Tamaño: 166 bytes
 * Líneas totales:        6
 * Líneas no vacías: 5
 * Caracteres:      166
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { clsx, type ClassValue } from "clsx"
 *   - { twMerge } from "tailwind-merge"
 * 
 * 📤 EXPORTS:
 *   - export function cn(...inputs: ClassValue[]) {
 * 
 * 🔖 TIPOS:
 *   - import { clsx, type ClassValue } from "clsx"
 * 
 * ⚡ FUNCIONES:
 *   - export function cn(...inputs: ClassValue[]) {()
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
