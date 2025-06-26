import { Marca} from "@/types";
import {baseURL, AxiosProtectedService, AxiosService } from "./api";

//Marcas
class MarcasService extends AxiosProtectedService{
  getMarcaByUsuario = (idUsuario: number | null) => {
    return this.instance.get(`/?id_usuario=${idUsuario}`);
  };
  createMarca = (marca:Marca) => {
    return this.instance.post("/",marca);
  };
}
export const marcasService=new MarcasService(`${baseURL}/marcas/`);

//Membresias
class MembresiasService extends AxiosService{
  getMembresiaByMarca = (idMarca: number) => {
    return this.instance.get(`/?id_marca=${idMarca}`);
  };
}
export const membresiasService=new MembresiasService(`${baseURL}/membresias/`);

//Planes
class PlanesService extends AxiosService{
  getPlan = async (planId: number) => {
    return await this.instance.get(`${planId}`);
  };
  getPlanes = () => {
    return this.instance.get("/");
  };
}
export const planesService=new PlanesService(`${baseURL}/planes/`);



/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: apiMarcas.ts
 * Ruta: 
 * Tamaño: 961 bytes
 * Líneas totales:       34
 * Líneas no vacías: 29
 * Caracteres:      961
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { Marca} from "@/types";
 *   - {baseURL, AxiosProtectedService, AxiosService } from "./api";
 * 
 * 📤 EXPORTS:
 *   - export const marcasService=new MarcasService(`${baseURL}/marcas/`);
 *   - export const membresiasService=new MembresiasService(`${baseURL}/membresias/`);
 *   - export const planesService=new PlanesService(`${baseURL}/planes/`);
 * 
 * 🏛️  CLASES:
 *   - class MarcasService extends AxiosProtectedService{
 *   - class MembresiasService extends AxiosService{
 *   - class PlanesService extends AxiosService{
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -     return await this.instance.get(`${planId}`);
 *   -     return this.instance.get(`/?id_marca=${idMarca}`);
 *   -     return this.instance.get(`/?id_usuario=${idUsuario}`);
 *   - get: /
 *   - post: /
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - class MarcasService extends AxiosProtectedService{
 *   - class MembresiasService extends AxiosService{
 *   - class PlanesService extends AxiosService{
 *   - export const marcasService=new MarcasService(`${baseURL}/marcas/`);
 *   - export const membresiasService=new MembresiasService(`${baseURL}/membresias/`);
 *   - export const planesService=new PlanesService(`${baseURL}/planes/`);
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 5
 *   - Ratio código/comentarios: 9.66
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
