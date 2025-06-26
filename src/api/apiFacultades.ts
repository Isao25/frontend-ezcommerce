import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/facultades`;

export interface Facultad{
    codigo:number,
    nombre:string,
    siglas:string,
}

const facultadesApi = axios.create({
    baseURL: `${baseURL}` 
});

export const getAllFacultades = (page:number) => {
    return facultadesApi.get( `/?page=${page}`);
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiFacultades.ts
 * Ruta: 
 * Tamaño: 401 bytes
 * Líneas totales:       17
 * Líneas no vacías: 14
 * Caracteres:      401
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { baseURLCentralized } from '@/utils/constants';
 * 
 * 📤 EXPORTS:
 *   - export const baseURL = `${baseURLCentralized}/facultades`;
 *   - export const getAllFacultades = (page:number) => {
 *   - export interface Facultad{
 * 
 * 📋 INTERFACES:
 *   - export interface Facultad{
 * 
 * ⚡ FUNCIONES:
 *   - export const getAllFacultades = (page:number) => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -     return facultadesApi.get( `/?page=${page}`);
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - const facultadesApi = axios.create({
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
