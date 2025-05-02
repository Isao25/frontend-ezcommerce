import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getEtiquetas, Etiqueta } from "../../api/apiEtiquetas";
import { useNavigate } from "react-router";

export const SheetComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Navegar a la categoría seleccionada
  const goToCategory = (etiquetaId: number) => {
    setIsOpen(false); // Cerrar el Sheet antes de navegar
    navigate(`/search?etiquetas=${etiquetaId}`);
  };

  useEffect(() => {
    const fetchEtiquetas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEtiquetas();
        setEtiquetas(response.data.results); // Ajustar si la respuesta tiene otro formato
      } catch (err) {
        console.error("Error al obtener las etiquetas:", err);
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchEtiquetas();
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="justify-between w-60 border-r-2">
          Categorías
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Categorías</SheetTitle>
          <SheetDescription>
            Selecciona una categoría para navegar por los productos.
          </SheetDescription>
        </SheetHeader>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {etiquetas.length > 0 ? (
              etiquetas.map((etiqueta) => (
                <Button
                  key={etiqueta.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => goToCategory(etiqueta.id)}
                >
                  {etiqueta.nombre}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No hay categorías disponibles.</p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
