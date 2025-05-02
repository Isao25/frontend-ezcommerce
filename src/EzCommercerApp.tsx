import routes from "./router/AppRouter"
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {AuthProvider} from "./context/AuthContext";
import { TrademarkProvider } from "./context/TrademarkContext";
import { EtiquetasProvider } from "./context/EtiquetasContext";
import { FavouritesProvider } from "./context/FavouritesContext";
import { CartProvider } from "./context/CartContext";




export const EzCommercerApp = () => {
  return (
    <HelmetProvider>
      <EtiquetasProvider>
        <AuthProvider>
          <TrademarkProvider>
            <FavouritesProvider>
              <CartProvider>
                <RouterProvider router={routes} />
              </CartProvider>       
            </FavouritesProvider>
          </TrademarkProvider> 
        </AuthProvider>
      </EtiquetasProvider>
    </HelmetProvider>
  )
}
