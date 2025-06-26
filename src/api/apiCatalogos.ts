import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/catalogos`;

const catalogosApi = axios.create({
    baseURL: `${baseURL}` 
});

export const getCatalogoUser= (id_usuario:number) => {
    return catalogosApi.get(`/?id_usuario=${id_usuario}`);
}

export const getCatalogoById= (id:number) => {
    return catalogosApi.get(`/${id}`);
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiCatalogos.ts
 * Ruta: 
 * Tamaño: 415 bytes
 * Líneas totales:       15
 * Líneas no vacías: 12
 * Caracteres:      415
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { baseURLCentralized } from '@/utils/constants';
 * 
 * 📤 EXPORTS:
 *   - export const baseURL = `${baseURLCentralized}/catalogos`;
 *   - export const getCatalogoById= (id:number) => {
 *   - export const getCatalogoUser= (id_usuario:number) => {
 * 
 * ⚡ FUNCIONES:
 *   - export const getCatalogoById= (id:number) => {()
 *   - export const getCatalogoUser= (id_usuario:number) => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -     return catalogosApi.get(`/${id}`);
 *   -     return catalogosApi.get(`/?id_usuario=${id_usuario}`);
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - const catalogosApi = axios.create({
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 2
 *   - Ratio código/comentarios: 12.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
