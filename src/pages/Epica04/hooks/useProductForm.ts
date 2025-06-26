import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { UploadedImage } from "./useImageUpload";
import { createArticulo, Articulo, updateArticulo } from "../../../api/apiArticulos";
import { createImage, updateImage } from "../../../api/apiImages";
import { getFileURL } from "../../../utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { LoadCatalogos } from "../../../helpers/LoadCatalogos";
import { useEffect, useState } from "react";
import { LoadUsuarios } from "../../../helpers/getUser";

// Esquema de validación de Zod
const formSchema = z.object({
  nombre: z.string().min(1, { message: "Este campo es requerido" }),
  precio: z.coerce.number().min(0, { message: "El precio debe ser un número no negativo" }),
  stock: z.coerce.number().min(1, { message: "El stock debe ser un número no negativo" }),
  descripcion: z.string().min(10, { message: "Este campo es requerido con un mínimo de 10 caracteres" }),
  etiquetas: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "Selecciona al menos una etiqueta",
  }),
  id_marca: z.number().nullable().optional(),
  is_marca: z.boolean().default(false),
});

interface UseProductFormProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}


export const useProductForm = ({
  images,
  setImages,
  product,
}: UseProductFormProps & { product?: Articulo }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [catalogos, setCatalogos] = useState<Array<{
    id: number;
    id_usuario: number;
    id_marca: number | null;
    capacidad_maxima: number;
    espacio_ocupado: number;
  }>>([]);
  const [isMarca, setIsMarca] = useState(false);

  useEffect(() => {
    if (authState.userId !== null) {
      LoadUsuarios(authState.userId).then((data) => {
        if (data) {
          setIsMarca(data.tiene_marca);
        } else {
          console.error("No se encontró información del usuario.");
        }
      });
    }
  }, [authState.userId]);

  useEffect(() => {
    if (authState.userId !== null) {
      LoadCatalogos(authState.userId).then((data) => {
        if (data) {
          setCatalogos(data);
        } else {
          console.error("No se encontraron catálogos para este usuario.");
        }
      });
    }
  }, [authState.userId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: product?.nombre ?? "",
      descripcion: product?.descripcion ?? "",
      precio: product?.precio ?? 0,
      stock: product?.stock ?? 1,
      etiquetas: product?.etiquetas ?? [],
      id_marca: product?.id_marca ?? null,
      is_marca: product?.id_marca ? true : false,
    },
  });

  const processImages = async (images: UploadedImage[], productId: number) => {
    for (const image of images) {
      if (image.file) {
        // Nueva imagen: Subir a Firebase y registrar en el backend
        try {
          const storageDir = `product_image/${productId}`;
          const url = await getFileURL(image.file, storageDir);
          if (url) {
            await createImage({ id_articulo: productId, url });
          } else {
            throw new Error("No se pudo obtener la URL de la imagen.");
          }
        } catch (error) {
          console.error("Error al subir nueva imagen:", error);
          throw new Error("Error al subir nueva imagen.");
        }
      } else {
        // Imagen existente: actualizar en el backend
        try {
          await updateImage(Number(image.id), { id_articulo: productId, url: image.preview });
        } catch (error) {
          console.error("Error al actualizar imagen existente:", error);
          throw new Error("Error al actualizar imagen existente.");
        }
      }
    }
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedCatalogo = values.is_marca
        ? catalogos.find((catalogo) => catalogo.id_marca !== null)
        : catalogos.find((catalogo) => catalogo.id_marca === null);

      if (!selectedCatalogo) throw new Error("No se encontró un catálogo adecuado.");
//@ts-ignore
      const productData: Articulo = {
        ...values,
        id_catalogo: selectedCatalogo.id,
        id_marca: selectedCatalogo.id_marca ?? undefined,
      };

      let productId: number;

      if (product) {
        const response = await updateArticulo(product.id!, productData);
        productId = response.data.id;
      } else {
        const response = await createArticulo(productData);
        productId = response.data.id;
      }

      await processImages(images, productId);
      navigate("/my-published-products");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };
  return { form, onSubmit, isMarca };
};

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: useProductForm.ts
 * Ruta: 
 * Tamaño: 4988 bytes
 * Líneas totales:      144
 * Líneas no vacías: 132
 * Caracteres:     4988
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - * as z from "zod";
 *   - { LoadCatalogos } from "../../../helpers/LoadCatalogos";
 *   - { LoadUsuarios } from "../../../helpers/getUser";
 *   - { UploadedImage } from "./useImageUpload";
 *   - { createArticulo, Articulo, updateArticulo } from "../../../api/apiArticulos";
 *   - { createImage, updateImage } from "../../../api/apiImages";
 *   - { getFileURL } from "../../../utils/helpers";
 *   - { useAuth } from "@/hooks/useAuth";
 *   - { useEffect, useState } from "react";
 *   - { useForm } from "react-hook-form";
 *   - { useNavigate } from "react-router-dom";
 *   - { zodResolver } from "@hookform/resolvers/zod";
 * 
 * 📤 EXPORTS:
 *   - export const useProductForm = ({
 * 
 * 📋 INTERFACES:
 *   - interface UseProductFormProps {
 * 
 * ⚡ FUNCIONES:
 *   -   const onSubmit = async (values: z.infer<typeof formSchema>) => {()
 *   -   const processImages = async (images: UploadedImage[], productId: number) => {()
 * 
 * 🎣 REACT HOOKS:
 *   - export const useProductForm = ({
 *   - useAuth
 *   - useEffect
 *   - useNavigate
 *   - useState
 * 
 * ⚛️  COMPONENTES REACT:
 *   - Array
 *   - UploadedImage
 * 
 * 🗄️  MODELOS/BD:
 *   - const formSchema = z.object({
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * ⚠️  MANEJO DE ERRORES:
 *   - Try-catch blocks: 3
 *   - Error throws: 4
 *   - Error instances: 4
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - React detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 27
 *   - Ratio código/comentarios: 33.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
