import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { ProductForm } from "../../components/Epica04/ProductForm";
import { useEffect, useState } from "react";
import { getArticulo } from "../../api/apiArticulos";
import { LoadImageMajor } from "../../helpers/getImageMajor"; // Importar el helper
import { UploadedImage } from "../../pages/Epica04/hooks/useImageUpload"; // Tipo para imágenes
import { Articulo as a } from "../../api/apiArticulos";

export const EditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [productToEdit, setProductToEdit] = useState<a>();
  const [productImages, setProductImages] = useState<UploadedImage[]>([]); // Estado para las imágenes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Obtener el producto
        const productResponse = await getArticulo(Number(productId));
        setProductToEdit(productResponse.data);

        // Obtener las imágenes asociadas al producto utilizando el helper
        const images = await LoadImageMajor(Number(productId));
        const transformedImages = images.map((img: any) => ({
          id: img.id.toString(), // ID del backend
          file: null, // No tenemos el archivo original, solo la URL
          preview: img.url, // URL de la imagen
        }));
        setProductImages(transformedImages); // Actualizar el estado con las imágenes cargadas
      } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductData();
  }, [productId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!productToEdit) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <>
      <Helmet>
        <title>Editar {productToEdit.nombre}</title>
      </Helmet>
      <ProductForm product={productToEdit} initialImages={productImages} />
    </>
  );
};
