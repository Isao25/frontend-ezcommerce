import { getCatalogoById } from "../api/apiCatalogos";
import { getUsuarios } from "../api/apiUsuarios";
import { getArticulo } from "../api/apiArticulos";
import { LoadImageMajor } from "./getImageMajor";

export interface ProductCart {
  ownerProduct: string;
  productTitle: string;
  productPrice: number;
  productDescription: string;
  productUrl: string;
  productRating: number;
  quantity: number;
}

export const getProductCart = async (id: number): Promise<ProductCart> => {
  try {
    const productResponse = await getArticulo(id);
    const product = productResponse.data;

    if (!product) {
      throw new Error(`No se encontró el producto con ID ${id}`);
    }

    let imageUrl = "";
    try {
      const images = await LoadImageMajor(product.id);
      imageUrl = images.length > 0 ? images[0].url : "placeholder.jpg";
    } catch (error) {
      console.error(`Error al obtener las imágenes:`, error);
    }

    let ownerProduct = "Usuario desconocido";
    try {
      const catalogoResponse = await getCatalogoById(product.id_catalogo);
      const catalogo = catalogoResponse.data;

      if (catalogo?.id_usuario) {
        const userResponse = await getUsuarios(catalogo.id_usuario);
        ownerProduct = userResponse.data?.nombres ?? ownerProduct;
      }
    } catch (error) {
      console.error(`Error al obtener el usuario del catálogo:`, error);
    }

    return {
      ownerProduct,
      productTitle: product.nombre,
      productPrice: product.precio,
      productDescription: product.descripcion,
      productUrl: imageUrl,
      productRating: 4,
      quantity: 1, // Cambiado de 0 a 1
    };
  } catch (error) {
    console.error("Error al obtener el ProductCart:", error);
    throw error;
  }
};
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: getProducCart.ts
 * Ruta: 
 * Tamaño: 1749 bytes
 * Líneas totales:       58
 * Líneas no vacías: 52
 * Caracteres:     1749
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - { LoadImageMajor } from "./getImageMajor";
 *   - { getArticulo } from "../api/apiArticulos";
 *   - { getCatalogoById } from "../api/apiCatalogos";
 *   - { getUsuarios } from "../api/apiUsuarios";
 * 
 * 📤 EXPORTS:
 *   - export const getProductCart = async (id: number): Promise<ProductCart> => {
 *   - export interface ProductCart {
 * 
 * 📋 INTERFACES:
 *   - export interface ProductCart {
 * 
 * ⚡ FUNCIONES:
 *   - export const getProductCart = async (id: number): Promise<ProductCart> => {()
 * 
 * ⚛️  COMPONENTES REACT:
 *   - ProductCart
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Try-catch blocks: 3
 *   - Error throws: 1
 *   - Error instances: 1
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 3
 *   - Ratio código/comentarios: 52.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
