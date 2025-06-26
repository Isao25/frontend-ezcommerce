import {Usuario } from '@/types';
import axios from 'axios';
import { AxiosService, baseURL } from './api';

//Usuarios
export const usuariosApi = axios.create({
  baseURL: `${baseURL}/usuarios/` 
});

// Interceptor para agregar el token de acceso a las solicitudes
usuariosApi.interceptors.request.use(
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


export const createUsuario = (usuario:Usuario) => {
  return usuariosApi.post('/', usuario);
};

export const getUsuarios = (userId:number) => {
  return usuariosApi.get(`/${userId}`);
}

//Escuelas
export class EscuelasService extends AxiosService{
  getEscuelas = () => {
    return this.instance.get('/');
  }
}
export const escuelasService= new EscuelasService(`${baseURL}/escuelasprofesionales/`);



/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiUsuarios.ts
 * Ruta: 
 * Tamaño: 1088 bytes
 * Líneas totales:       44
 * Líneas no vacías: 36
 * Caracteres:     1088
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios from 'axios';
 *   - { AxiosService, baseURL } from './api';
 *   - {Usuario } from '@/types';
 * 
 * 📤 EXPORTS:
 *   - export const createUsuario = (usuario:Usuario) => {
 *   - export const escuelasService=new EscuelasService(`${baseURL}/escuelasprofesionales/`);
 *   - export const getUsuarios = (userId:number) => {
 *   - export const usuariosApi = axios.create({
 * 
 * 🏛️  CLASES:
 *   - class EscuelasService extends AxiosService{
 * 
 * ⚡ FUNCIONES:
 *   - export const createUsuario = (usuario:Usuario) => {()
 *   - export const getUsuarios = (userId:number) => {()
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -   return usuariosApi.get(`/${userId}`);
 *   - get: /
 *   - post: /
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - class EscuelasService extends AxiosService{
 *   - export const escuelasService=new EscuelasService(`${baseURL}/escuelasprofesionales/`);
 *   - export const usuariosApi = axios.create({
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Error instances: 1
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 6
 *   - Ratio código/comentarios: 12.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
