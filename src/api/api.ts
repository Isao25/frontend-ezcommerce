import { logout, refreshAccessToken } from "@/context/AuthContext";
import { Tokens } from "@/types";
import { baseURLCentralized } from "@/utils/constants";
import axios, { AxiosInstance} from "axios";
export const baseURL = baseURLCentralized;

export class AxiosService {
  instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
  }
}

export class AxiosProtectedService extends AxiosService {
  constructor(baseURL: string) {
    super(baseURL);
    this.addInterceptors();
  }

  addInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const tokens: Tokens | null = JSON.parse(localStorage.getItem("tokens") ?? "null");
      if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await refreshAccessToken();
            if (newTokens) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
              return this.instance(originalRequest);
            }
            logout();
            return Promise.reject(new Error("Token refresh failed (no tokens returned)"));
          } catch (e) {
            console.error("Error refreshing token:", e);
            logout();
            return Promise.reject(new Error("Token refresh failed"));
          }
        }

        return Promise.reject(new Error("Request failed")); // <- más genérico pero válido
      }
    );
  }
}
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: api.ts
 * Ruta: 
 * Tamaño: 1785 bytes
 * Líneas totales:       58
 * Líneas no vacías: 51
 * Caracteres:     1785
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - axios, { AxiosInstance} from "axios";
 *   - { Tokens } from "@/types";
 *   - { baseURLCentralized } from "@/utils/constants";
 *   - { logout, refreshAccessToken } from "@/context/AuthContext";
 * 
 * 📤 EXPORTS:
 *   - export class AxiosProtectedService extends AxiosService {
 *   - export class AxiosService {
 *   - export const baseURL = baseURLCentralized;
 * 
 * 🏛️  CLASES:
 *   - export class AxiosProtectedService extends AxiosService {
 *   - export class AxiosService {
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 🔧 SERVICIOS:
 *   - export class AxiosProtectedService extends AxiosService {
 *   - export class AxiosService {
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Try-catch blocks: 1
 *   - Error instances: 3
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - Axios detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 6
 *   - Ratio código/comentarios: 51.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
