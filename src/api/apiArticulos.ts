import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/articulos`;

export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  etiquetas: number[];
  id_marca?: number;
  is_marca: boolean;
  id_catalogo: number;
  imageUrl?: string;
}

const articulosApi = axios.create({
  baseURL: `${baseURL}`,
});


articulosApi.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}");
    const accessToken = tokens?.access ?? null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("No access token found");
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error("Request interceptor error")
    );
  }
);

export const getArticulos = () => {
  return articulosApi.get('/');
}

export const createArticulo = (articulo: Articulo) => {
  return articulosApi.post('/', articulo);
};

export const updateArticulo = (id: number, articulo: Articulo) => {
  return articulosApi.put(`/${id}/`, articulo);
}

export const deleteArticulo = (id: number) => {
  return articulosApi.delete(`/${id}/`);
};

export const getArticulo = (id: number) => {
  return articulosApi.get(`/${id}`);
}

export const getArticulosByUsuario = (usuarioId: number) => {
  return articulosApi.get(`/?id_catalogo__id_usuario=${usuarioId}`);
};


/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiArticulos.ts
 * Ruta: 
 * Tamaño: 1529 bytes
 * Líneas totales:       66
 * Líneas no vacías: 53
 * Caracteres:     1529
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { baseURLCentralized } from '@/utils/constants';
 * 
 * 📤 EXPORTS:
 *   - export const baseURL = `${baseURLCentralized}/articulos`;
 *   - export const createArticulo = (articulo: Articulo) => {
 *   - export const deleteArticulo = (id: number) => {
 *   - export const getArticulo = (id: number) => {
 *   - export const getArticulos = () => {
 *   - export const getArticulosByUsuario = (usuarioId: number) => {
 *   - export const updateArticulo = (id: number, articulo: Articulo) => {
 *   - export interface Articulo {
 * 
 * 📋 INTERFACES:
 *   - export interface Articulo {
 * 
 * ⚡ FUNCIONES:
 *   - export const createArticulo = (articulo: Articulo) => {()
 *   - export const deleteArticulo = (id: number) => {()
 *   - export const getArticulo = (id: number) => {()
 *   - export const getArticulos = () => {()
 *   - export const getArticulosByUsuario = (usuarioId: number) => {()
 *   - export const updateArticulo = (id: number, articulo: Articulo) => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -   return articulosApi.delete(`/${id}/`);
 *   -   return articulosApi.get(`/${id}`);
 *   -   return articulosApi.get(`/?id_catalogo__id_usuario=${usuarioId}`);
 *   -   return articulosApi.put(`/${id}/`, articulo);
 *   - get: /
 *   - post: /
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - const articulosApi = axios.create({
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Error instances: 1
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 9
 *   - Ratio código/comentarios: 53.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
