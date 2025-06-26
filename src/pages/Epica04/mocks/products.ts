export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  description: string;
  category: "electronics" | "clothing" | "home" | "books" | "other";
  condition: "new" | "used" | "refurbished";
  stock: number;
}

// Datos de ejemplo
export const products: Product[] = [
  {
    id: 1,
    name: "Audífonos Sony",
    price: 34.00,
    imageUrl: "image-card.jpg",
    rating: 4.8,
    description: "Audífonos Sony de alta calidad con cancelación de ruido.",
    category: "electronics",
    condition: "new",
    stock: 20,
  },
  {
    id: 2,
    name: "Auriculares Bose",
    price: 79.99,
    imageUrl: "image-card.jpg",
    rating: 4.7,
    description: "Auriculares Bose con sonido envolvente.",
    category: "electronics",
    condition: "new",
    stock: 15,
  },
  {
    id: 3,
    name: "Auriculares JBL",
    price: 49.99,
    imageUrl: "image-card.jpg",
    rating: 4.5,
    description: "Auriculares JBL con bajos profundos y diseño cómodo.",
    category: "electronics",
    condition: "used",
    stock: 10,
  },
  // Puedes agregar más productos según sea necesario
];

// Función para obtener un producto por su ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
}

// Función para actualizar un producto en la lista
export const updateProduct = (updatedProduct: Product): boolean => {
  const index = products.findIndex(product => product.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return true;
  }
  return false;
}

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: products.ts
 * Ruta: 
 * Tamaño: 1649 bytes
 * Líneas totales:       64
 * Líneas no vacías: 61
 * Caracteres:     1649
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📤 EXPORTS:
 *   - export const getProductById = (id: number): Product | undefined => {
 *   - export const products: Product[] = [
 *   - export const updateProduct = (updatedProduct: Product): boolean => {
 *   - export interface Product {
 * 
 * 📋 INTERFACES:
 *   - export interface Product {
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 5
 *   - Ratio código/comentarios: 15.25
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
