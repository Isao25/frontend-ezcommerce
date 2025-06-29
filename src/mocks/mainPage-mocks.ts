import { ISellersCardProps } from "../components/cards/sellers-card";
import TestProduct from '../../public/image-card.jpg'
import BannerPrueba from '../assets/banner_prueba.webp'
import { IProductCardProps } from "../components/cards/product-card";
import estudio from '../assets/estudio.jpg'
import accesorios from '../assets/accesorios.avif'
import materiales from '../assets/materiales.jpg'
import electronica from '../assets/electronica.jpg'

export const distinguishedSellers: ISellersCardProps[] = [
    {
        id: '1',
        name: 'Juan Rodriguez',
    },
    {
        id: '2',
        name: 'Maria Garcia',
    },
    {
        id: '3',
        name: 'Carlos Lopez',
    },
    {
        id: '4',
        name: 'Ana Martinez',
    },
    {
        id: '5',
        name: 'Pedro Fernandez',
    },
    {
        id: '6',
        name: 'Sofia Ramirez',
    },
    {
        id: '7',
        name: 'Luis Perez',
    },
    {
        id: '8',
        name: 'Elena Sanchez',
    }
]

export const categories = [
    {   
      id: 4,  
      image: electronica,
      title: 'Electrónica',
      description: 'Componentes electrónicos esenciales para proyectos y reparaciones.',
      horiz: false  
    },
    { 
      id: 5,  
      image: estudio,
      title: 'Estudio',
      description: 'Material de estudio y herramientas indispensables para el aprendizaje.',
      horiz: true
    },
    { 
      id: 6,    
      image: materiales,
      title: 'Insumos académicos',
      description: 'Materiales esenciales para toda la carrera universitaria.',
      horiz: true
    },
    {
      id: 8,  
      image: accesorios,
      title: 'Accesorios',
      description: 'Complementos prácticos y útiles para diferentes actividades.',
      horiz: false
    },
  ];

export const mockProducts: IProductCardProps[] = [
    {
        id: 1,
        name: "Smartphone X",
        price: 499.99,
        img: TestProduct,
        brand: "BrandX",
        qualification: 4.5
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 1299.99,
        img: TestProduct,
        brand: "TechMaster",
        qualification: 4.7
    },
    {
        id: 3,
        name: "Wireless Earbuds",
        price: 99.99,
        img: TestProduct,
        brand: "SoundMax",
        qualification: 4.3
    },
    {
        id: 4,
        name: "4K TV",
        price: 799.99,
        img: TestProduct,
        brand: "UltraVision",
        qualification: 4.6
    },
    {
        id: 5,
        name: "Smartwatch Series 5",
        price: 199.99,
        img: TestProduct,
        brand: "WearableTech",
        qualification: 4.2
    },
    {
        id: 6,
        name: "Gaming Console",
        price: 499.99,
        img: TestProduct,
        brand: "PlayMaster",
        qualification: 4.8
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        price: 49.99,
        img: TestProduct,
        brand: "SoundWave",
        qualification: 4.0
    },
    {
        id: 8,
        name: "Tablet Pro",
        price: 349.99,
        img: TestProduct,
        brand: "TabCo",
        qualification: 4.4
    }
];

export const images = [
    {
        src: BannerPrueba,
        alt:'Imagen prueba banner'
    },
    {
        src: BannerPrueba,
        alt:'Imagen prueba banner'
    },
    {
        src: BannerPrueba,
        alt:'Imagen prueba banner'
    },
    {
        src: BannerPrueba,
        alt:'Imagen prueba banner'
    }
]
/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: mainPage-mocks.ts
 * Ruta: 
 * Tamaño: 3464 bytes
 * Líneas totales:      159
 * Líneas no vacías: 156
 * Caracteres:     3464
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - BannerPrueba from '../assets/banner_prueba.webp'
 *   - TestProduct from '../../public/image-card.jpg'
 *   - accesorios from '../assets/accesorios.avif'
 *   - electronica from '../assets/electronica.jpg'
 *   - estudio from '../assets/estudio.jpg'
 *   - materiales from '../assets/materiales.jpg'
 *   - { IProductCardProps } from "../components/cards/product-card";
 *   - { ISellersCardProps } from "../components/cards/sellers-card";
 * 
 * 📤 EXPORTS:
 *   - export const categories = [
 *   - export const distinguishedSellers: ISellersCardProps[] = [
 *   - export const images = [
 *   - export const mockProducts: IProductCardProps[] = [
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 10
 *   - Ratio código/comentarios: 156.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
