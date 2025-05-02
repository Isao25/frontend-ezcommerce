import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductCart, getProductCart } from "../helpers/getProducCart";
import { toast } from "sonner";

interface CartContextType {
  items: ProductCart[];
  addItem: (id: number, quantity?: number) => Promise<void>;
  removeItem: (productTitle: string) => void;
  updateItemQuantity: (productTitle: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductCart[]>([]);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  // Cargar el carrito desde el localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          const validatedCart = parsedCart.map((item) => ({
            ...item,
            quantity: Math.max(item.quantity, 1), // Asegura que quantity sea al menos 1
          }));
          setItems(validatedCart);
        } else {
          localStorage.removeItem("cart");
        }
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
    setLoading(false); // Carga inicial completada
  }, []);

  // Sincronizar el carrito con el localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loading]);

  const addItem = async (id: number, quantity = 1) => {
    try {
      const productCart = await getProductCart(id);

      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productTitle === productCart.productTitle
        );

        if (existingItem) {
          toast.warning(`${productCart.productTitle} ya está en el carrito.`);
          return prevItems.map((item) =>
            item.productTitle === productCart.productTitle
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        toast.success(`${productCart.productTitle} se agregó al carrito.`);
        return [...prevItems, { ...productCart, quantity }];
      });
    } catch (error) {
      toast.error("Error al agregar producto al carrito.");
    }
  };

  const removeItem = (productTitle: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productTitle !== productTitle)
    );
    toast.success(`${productTitle} se eliminó del carrito.`);
  };

  const updateItemQuantity = (productTitle: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productTitle === productTitle ? { ...item, quantity } : item
      )
    );
    toast.info(`Cantidad actualizada para ${productTitle}.`);
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Carrito vaciado.");
  };

  // Retrasar el renderizado hasta que el carrito esté completamente cargado
  if (loading) {
    return null; // Muestra un spinner o nada mientras carga
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateItemQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
