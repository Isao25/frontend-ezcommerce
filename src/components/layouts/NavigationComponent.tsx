import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


import { SheetComponent } from "./SheetComponent";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { hash } from "../../utils/strings";

const navigationItems = [
  { item: 'Venta', link: '/products-management' },
  { item: 'Vendedores estudiantiles', link: '/sellers' },
  { item: 'Chat', link: '/chat' },
];

export const NavigationComponent = () => {
  const { authState, setLoginModal } = useAuth();
  const navigate=useNavigate();

  const handleNavigationClick = (link:string) => {
    if (!authState.userId) {
      setLoginModal(true);
    } else {
      navigate(link);
    }
  };

  return (
    
      <NavigationMenu>
        <NavigationMenuList className="space-x-8 flex flex-wrap">
          <NavigationMenuItem>
            <SheetComponent />
          </NavigationMenuItem>
          {navigationItems.map((item, _index) => (
            <NavigationMenuItem key={`nm-${hash(item.item)}`}>
              <Button
                variant="link"
                onClick={() => handleNavigationClick(item.link)}
              >
                {item.item}
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
   
  );
};