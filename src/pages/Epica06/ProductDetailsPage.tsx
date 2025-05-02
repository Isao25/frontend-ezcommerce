import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ChevronLeft,
  Flag,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ProductCard } from "@/components/cards/product-card";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getArticulo, Articulo, getArticulos } from "@/api/apiArticulos";
import { Link } from "react-router-dom";
import { LoadImageMajor } from "@/helpers/getImageMajor";
import { useCartContext } from "../../context/CartContext";
import { useFavouritesContext } from "@/context/FavouritesContext";

type Image = {
  id: number;
  url: string;
};

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [productos, setProductos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const { addItem } = useCartContext();
  const { favourites, toggleFavourite } = useFavouritesContext();
  

  const fetchImage = async () => {
    try {
      const response = await LoadImageMajor(Number(productId));
      setImages(response.map((img: Image) => img.url));
      //console.log("Imagenes: ", response);
    } catch (error) {
      console.error(error);
      setImages([]);
    }
  };

  useEffect(() => {
    const fetchArticulo = async (id: number) => {
      setIsLoading(true);
      try {
        const response = await getArticulo(id);
        setArticulo(response.data);

        const responseProductos = await getArticulos();
        setProductos(responseProductos.data.results);

        console.log(response.data);
        console.log(responseProductos.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchArticulo(Number(productId));
      fetchImage();
    }
  }, [productId]);

  const incrementQuantity = () => {
    if (articulo?.stock) {
      setQuantity((prev) => Math.min(prev + 1, articulo?.stock));
    }
  };
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  if (!articulo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Ups! Producto no encontrado 😅 </p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (articulo) {
      addItem(articulo.id, quantity); // Agregar el producto con la cantidad seleccionada
    }
  };

  const isFavourite = favourites.includes(articulo.id);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "fill-[#FABC3F] text-[#FABC3F]"
              : "fill-white text-[#FABC3F]"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terciaryLight"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Helmet>
        <title>{articulo?.nombre}</title>
      </Helmet>

      <div className="flex flex-wrap justify-between items-center gap-4 py-8">
        {/* Título del detalle del producto */}
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full hover:bg-accent p-2">
            <ChevronLeft></ChevronLeft>
          </Link>
          <h3 className="text-lg md:text-xl font-semibold">
            Detalles del producto
          </h3>
        </div>

        {/* Migas de pan (Breadcrumb) */}
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-2 text-sm md:text-base">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-primary hover:underline">
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground">
                Productos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="w-full grid gap-8 mt-8 md:grid-cols-2">
          {/* PANEL IZQUIERDO - IMÁGENES */}
          <div className="flex flex-col justify-center items-center">
            <Card className="mb-4 flex justify-center items-center w-full h-[320px] md:h-[448px]">
              <CardContent className="p-0">
                <div>
                  <img
                    src={`${images[0]}`}
                    alt={`${articulo.nombre}`}
                    className="rounded-lg w-full max-w-sm h-auto scale-90 self-center mix-blend-multiply "
                  />
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-4 gap-2 w-full">
              {images.slice(1).map((url, id) => (
                <Card key={id} className="flex justify-center items-center">
                  <CardContent className="p-0">
                    <div className="flex justify-center items-center aspect-square relative">
                      <img
                        src={url ?? "/placeholder..svg"}
                        alt={`Image ${id + 1}`}
                        className="rounded-md scale-90 w-full mix-blend-multiply "
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO - INFORMACIÓN DEL PRODUCTO */}
          <div className="flex flex-col justify-between py-2 px-4 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Juan Carlos Rodriguez
                  </p>
                  <h1 className="text-lg md:text-2xl font-bold mb-4 text-terciaryLight">
                    {articulo.nombre}
                  </h1>
                  <p className="text-lg md:text-xl font-semibold text-terciaryLight">
                    S/ {articulo.precio.toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary" className="uppercase text-[#555]">
                  FISI
                </Badge>
              </div>
              <p className="text-sm md:text-base text-[#555] mb-4">
                {articulo.descripcion}
              </p>
            </div>

            {/* Botones y opciones */}
            <div>
              <div className="flex flex-wrap items-center mb-6 gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#555]"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  className="w-16 text-center text-sm md:text-right text-[#555]"
                  value={quantity}
                  readOnly
                />
                <Button
                  variant="default"
                  size="icon"
                  onClick={incrementQuantity}
                  className="bg-[#555] hover:bg-[#555]/80"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-xs md:text-sm text-gray-500">
                  Máximo de {articulo.stock} unidades
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="flex-1 bg-secondaryLight hover:bg-secondaryLight/80 py-5 text-primaryLight text-sm md:text-[16px]" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al carrito
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`p-5 md:p-5 ${isFavourite ? "fill-primary" : ""}`}
                  onClick={() => toggleFavourite(articulo.id)}
                >
                  <Heart className={`h-4 w-4 ${isFavourite ? "text-red-500" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />

        <div className="flex flex-col w-full gap-6 self-stretch my-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-terciaryLight">
              Productos similares
            </h3>
          </div>
          <div className=" justify-center mx-auto max-w-[1350px] px-8 ">
            <Carousel
              opts={{
                align: "start",
                loop: false,
                dragFree: true,
              }}
            >
              <CarouselContent className="-ml-1">
                {productos.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-1/1 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                  >
                    <ProductCard
                      id={product.id ?? 0}
                      name={product.nombre}
                      price={product.precio}
                      qualification={4}
                      img={
                        "https://www.az-delivery.uk/cdn/shop/products/esp32-nodemcu-module-wlan-wifi-development-board-mit-cp2102-nachfolgermodell-zum-esp8266-kompatibel-mit-arduino-872375_grande.jpg?v=1679400491"
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block ">
                <CarouselPrevious className="bg-white w-10 h-10 border-0 shadow-md shadow-[#767676]" />
                <CarouselNext className="bg-white w-10 h-10 border-0 shadow-md shadow-[#767676]" />
              </div>
            </Carousel>
          </div>
        </div>

        <Separator className="my-8"></Separator>

        <div className="w-full py-6 px-0">
          <h2 className="text-2xl font-semibold mb-6 text-[#555]">
            Calificación general
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap justify-center gap-6 md:gap-9">
                <div>
                  <div className="flex flex-col justify-center items-center gap-2 mb-2">
                    <span className="text-4xl font-bold">
                      {qualification.average}
                    </span>
                    <StarRating rating={Math.round(qualification.average)} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {qualification.total} comentarios
                  </p>
                </div>

                <div className="space-y-2 w-full md:w-56">
                  {qualification.distribution.map(({ stars, count }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-4 text-sm">{stars}</span>
                      <Star className="w-4 h-4" />
                      <Progress
                        value={(count / qualification.total) * 100}
                        className="h-2 "
                      />
                      <span className="w-8 text-sm text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-6 self-center w-full max-w-xs px-6 py-3"
                size="sm"
              >
                <Flag className="w-4 h-4 mr-2" />
                Reportar producto
              </Button>
            </div>

            <Card className="bg-secondaryLight/10 w-full md:max-w-[464px] justify-self-center md:justify-self-end">
              <CardHeader>
                <CardTitle className="mb-2 text-[#555]">
                  Comenta este producto
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tu opinión nos importa. Ayúdanos a mejorar dejando tu
                  comentario y calificación. ¡Nos gustaría conocer tu
                  experiencia!
                </p>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-secondaryLight hover:bg-secondaryLight/80 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  Calificar y comentar
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{review.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {review.author}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  <p className="text-sm mt-4 mb-4">{review.content}</p>

                  <Button variant="outline" size="sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reportar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const qualification = {
  average: 4.5,
  total: 50,
  distribution: [
    { stars: 5, count: 20 },
    { stars: 4, count: 3 },
    { stars: 3, count: 3 },
    { stars: 2, count: 10 },
    { stars: 1, count: 0 },
  ],
};

interface Review {
  id: number;
  title: string;
  author: string;
  rating: number;
  content: string;
}

const reviews: Review[] = [
  {
    id: 1,
    title: "Está bueno",
    author: "Juan Rodriguez",
    rating: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sapien lacus, tempor non magna nec, porta cursus mauris. Curabitur condimentum suscipit est in convallis. Mauris euismod fermentum lacinia. Nulla nec est et justo iaculis vehicula. In elementum ullamcorper congue. Nulla condimentum, mi nec consectetur tristique, elit mauris pretium felis, non porttitor velit leo sit amet felis. Aenean tempus tempus condimentum. Cras rutrum magna est.",
  },
  {
    id: 2,
    title: "El producto no cumplió con lo acordado",
    author: "Juan Rodriguez",
    rating: 1,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sapien lacus, tempor non magna neo, porta cursus mauris. Curabitur condimentum suscipit est in convallis. Mauris euismod fermentum lacinia. Nulla nec est et justo iaculis vehicula. In elementum ullamcorper congue. Nulla condimentum, mi nec consectetur tristique, elit mauris pretium felis, non porttitor velit leo sit amet felis. Aenean tempus tempus condimentum. Cras rutrum magna est.",
  },
  {
    id: 3,
    title: "Excelente",
    author: "Juan Rodriguez",
    rating: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sapien lacus, tempor non magna neo, porta cursus mauris. Curabitur condimentum suscipit est in convallis. Mauris euismod fermentum lacinia. Nulla nec est et justo iaculis vehicula. In elementum ullamcorper congue. Nulla condimentum, mi nec consectetur tristique, elit mauris pretium felis, non porttitor velit leo sit amet felis. Aenean tempus tempus condimentum. Cras rutrum magna est.",
  },
];
