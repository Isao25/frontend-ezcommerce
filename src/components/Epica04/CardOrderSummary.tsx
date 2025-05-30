import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "../../context/CartContext";

export const CardOrderSummary = () => {
  const { items } = useCartContext();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  if (totalItems === 0) {
    return null;
  }

  return (
    <Card className="p-5 bg-[#003669]/10">
      <CardHeader className="border-b border-terciaryLight pt-2 pb-4 px-0">
        <CardTitle className="text-xl font-sans text-terciaryLight">Orden total</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-0 mt-3 text-base font-sans">
        <div className="flex justify-between items-center">
          <span>Productos</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total</span>
          <span>S/ {totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button className="w-full bg-secondaryLight hover:bg-blue-900">Continuar</Button>
      </CardFooter>
    </Card>
  );
};
