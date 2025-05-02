import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardShoppingCart } from "./CardShoppingCart";
import { ProductCart } from "../../helpers/getProducCart";
import { useCartContext } from "../../context/CartContext";

export const AccordionShoppingCart = () => {
  const { items } = useCartContext();
  const [groupedProducts, setGroupedProducts] = useState<Record<string, ProductCart[]>>({});

  const groupBySeller = (products: ProductCart[]): Record<string, ProductCart[]> => {
    return products.reduce((acc: Record<string, ProductCart[]>, product) => {
      const seller = product.ownerProduct || "Vendedor desconocido";
      if (!acc[seller]) acc[seller] = [];
      acc[seller].push(product);
      return acc;
    }, {});
  };

  useEffect(() => {
    setGroupedProducts(groupBySeller(items));
  }, [items]);

  if (!items.length) {
    return <p className="text-gray-500 text-center">Tu carrito está vacío.</p>;
  }

  return (
    <Accordion type="single" collapsible className="max-w-2xl">
      {Object.entries(groupedProducts).map(([seller, sellerProducts], index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="font-sans">
            <span className="text-[#555555]">Vendido por:</span>
            <span className="font-semibold"> {seller} </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {sellerProducts.map((product, idx) => (
              <CardShoppingCart key={`${product.productTitle}-${idx}`} product={product} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
