import axios from 'axios';
import { baseURL } from './api';


interface Image {
    id_articulo: number,
    url: string,
}

const imagesApi = axios.create({
    baseURL: `${baseURL}/imagenes`
});

// Interceptor para agregar el token de acceso a las solicitudes
imagesApi.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}");
    const accessToken = tokens?.access ?? null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } 
    
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error("Request interceptor error")
    );
  }
);


export const getAllImages = () => {
    return imagesApi.get('/');
}

export const getImage = (id: number) => {
    return imagesApi.get(`/?id_articulo=${id}`);
}

export const createImage = (image: Image) => {
    return imagesApi.post('/', image);
}

export const updateImage = (id: number, image: Image) => {
    return imagesApi.put(`/${id}/`, image);
}

export const deleteImage = (id: number) => {
    return imagesApi.delete(`/${id}/`);
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiImages.ts
 * Ruta: 
 * Tamaño: 1137 bytes
 * Líneas totales:       51
 * Líneas no vacías: 40
 * Caracteres:     1137
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { baseURL } from './api';
 * 
 * 📤 EXPORTS:
 *   - export const createImage = (image: Image) => {
 *   - export const deleteImage = (id: number) => {
 *   - export const getAllImages = () => {
 *   - export const getImage = (id: number) => {
 *   - export const updateImage = (id: number, image: Image) => {
 * 
 * 📋 INTERFACES:
 *   - interface Image {
 * 
 * ⚡ FUNCIONES:
 *   - export const createImage = (image: Image) => {()
 *   - export const deleteImage = (id: number) => {()
 *   - export const getAllImages = () => {()
 *   - export const getImage = (id: number) => {()
 *   - export const updateImage = (id: number, image: Image) => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -     return imagesApi.delete(`/${id}/`);
 *   -     return imagesApi.get(`/?id_articulo=${id}`);
 *   -     return imagesApi.put(`/${id}/`, image);
 *   - get: /
 *   - post: /
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - const imagesApi = axios.create({
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Error instances: 1
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 8
 *   - Ratio código/comentarios: 40.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
