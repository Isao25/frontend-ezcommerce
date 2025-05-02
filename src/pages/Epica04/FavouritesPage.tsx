import { Helmet } from "react-helmet-async";
import { ProductCard } from "../../components/cards/product-card";
import { useFavouritesContext } from "../../context/FavouritesContext"; // Nuevo hook del contexto
import { useState, useEffect } from "react";
import { getArticulos, Articulo } from "../../api/apiArticulos";
import { getAllImages } from "../../api/apiImages";

export const FavouritesPage = () => {
  const { favourites } = useFavouritesContext(); // Cambiado a usar el contexto
  const [products, setProducts] = useState<Articulo[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        // Obtener todos los artículos
        const articulosResponse = await getArticulos();
        const articulos = articulosResponse.data.results;

        // Obtener todas las imágenes
        const imagesResponse = await getAllImages();
        const images = imagesResponse.data.results;

        // Crear un mapa con la primera imagen de cada artículo
        interface Image {
          id_articulo: number;
          url: string;
        }

        const imageMap = images.reduce((acc: Record<number, string>, img: Image) => {
          if (!acc[img.id_articulo]) {
            acc[img.id_articulo] = img.url; // Usar la primera imagen disponible
          }
          return acc;
        }, {});

        // Filtrar los favoritos y asociar imágenes
        const favouriteProducts = articulos
          .filter((product: Articulo) => favourites.includes(product.id))
          .map((product: Articulo) => ({
            ...product,
            imageUrl: imageMap[product.id] || null, // Asociar la imagen principal
          }));

        setProducts(favouriteProducts);
      } catch (error) {
        console.error("Error al cargar los favoritos:", error);
      }
    };

    fetchFavourites();
  }, [favourites]); // Dependencia en favourites

  return (
    <>
      <Helmet>
        <title>Favoritos</title>
      </Helmet>

      <div className="my-3 py-2 px-12 space-y-4">
        <div className="text-4xl font-sans items-center">
          <span>Productos que te gustan</span>
        </div>
        <div className="flex items-center py-2 px-0">
          <p className="text-base">Aquí puedes encontrar todos tus productos favoritos.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-11 p-3">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nombre}
                price={product.precio}
                img={product.imageUrl || "default-image-url.jpg"} // Imagen por defecto si no hay
                qualification={4.4}
              />
            ))
          ) : (
            <p className="text-gray-500">No tienes productos favoritos aún.</p>
          )}
        </div>
      </div>
    </>
  );
};
