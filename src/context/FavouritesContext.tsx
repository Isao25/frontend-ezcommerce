import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from "react";
import { toast } from "sonner";

interface FavouritesContextProps {
  favourites: number[];
  toggleFavourite: (productId: number) => void;
}

const FavouritesContext = createContext<FavouritesContextProps | undefined>(undefined);

export const useFavouritesContext = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavouritesContext debe usarse dentro de FavouritesProvider");
  }
  return context;
};

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<number[]>(() => {
    const storedFavourites = localStorage.getItem("favourites");
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Memoiza la función toggleFavourite para evitar recrearla en cada render
  const toggleFavourite = useCallback((productId: number) => {
    setFavourites((prevFavourites) => {
      const isFavourite = prevFavourites.includes(productId);

      if (isFavourite) {
        toast.info("Se eliminó de favoritos.");
        return prevFavourites.filter((id) => id !== productId);
      } else {
        toast.success("Producto añadido a favoritos.");
        return [...prevFavourites, productId];
      }
    });
  }, []); // Array vacío porque no depende de ninguna variable externa

  // Memoiza el objeto del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(
    () => ({
      favourites,
      toggleFavourite,
    }),
    [favourites, toggleFavourite]
  );

  return (
    <FavouritesContext.Provider value={contextValue}>
      {children}
    </FavouritesContext.Provider>
  );
};