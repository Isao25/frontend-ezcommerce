import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/etiquetas`;


export interface Etiqueta{
    id:number,
    nombre:string,
    descripcion:string,
}

const etiquetasApi = axios.create({
    baseURL: `${baseURL}` 
});

export const getEtiquetas = () => {
    return etiquetasApi.get('/');
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiEtiquetas.ts
 * Ruta: 
 * Tamaño: 371 bytes
 * Líneas totales:       18
 * Líneas no vacías: 14
 * Caracteres:      371
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { baseURLCentralized } from '@/utils/constants';
 * 
 * 📤 EXPORTS:
 *   - export const baseURL = `${baseURLCentralized}/etiquetas`;
 *   - export const getEtiquetas = () => {
 *   - export interface Etiqueta{
 * 
 * 📋 INTERFACES:
 *   - export interface Etiqueta{
 * 
 * ⚡ FUNCIONES:
 *   - export const getEtiquetas = () => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   - get: /
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - const etiquetasApi = axios.create({
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 1
 *   - Ratio código/comentarios: 14.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
