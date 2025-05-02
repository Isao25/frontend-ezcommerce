import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronRight,
  User,
  Megaphone,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import { AvatarComponent } from "./AvatarComponent";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getUsuarios } from "../../api/apiUsuarios";
import { useEffect, useState } from "react";
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-300 p-1.5 rounded-full">{children}</div>
);

const options = [
  {
    icon: <Calendar className="h-4 w-4 text-black" />,
    text: "Gestión de compras",
    link: "/purchase-management",
  },
  {
    icon: <Megaphone className="h-4 w-4 text-black" />,
    text: "Publicar anuncio",
    link: "#",
  },
  {
    icon: <Settings className="h-4 w-4 text-black" />,
    text: "Configuración",
    link: "/profile-buyer",
  },
  {
    icon: <HelpCircle className="h-4 w-4 text-black" />,
    text: "Ayuda y soporte tecnico",
    link: "#",
  },
];

export const MenuAccount = () => {
  const { authState } = useAuth();
  function onLogoutClick() {
    logout();
    toast.success("Sesión terminada");
  }
  const { logout } = useAuth();

  const [user, setUser] = useState<{ nombres: string; apellido_p: string; apellido_m: string } | null>(null);

  useEffect(() => {
    if (authState.userId) {
      getUsuarios(authState.userId).then((response) => {
        setUser(response.data);
      });
    }
  }, [authState.userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User size={28} className="text-secondaryLight" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3">
        <DropdownMenuLabel className="flex items-center p-2">
          <AvatarComponent />
          <p className="text-sm font-semibold ml-6">
            {user?.nombres} {user?.apellido_p} 
            <br />
            {user?.apellido_m}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option.text} className="py-2">
            {authState.userId ? (
              <Link
                to={option.link}
                className="flex items-center w-full justify-between"
              >
                <div className="flex items-center">
                  <IconWrapper>{option.icon}</IconWrapper>
                  <span className="ml-3">{option.text}</span>
                </div>
                <ChevronRight className="h-4 w-4 ml-4" />
              </Link>
            ) : (
              <Button
                onClick={() =>
                  toast.error("Inicie sesión para acceder a este módulo")
                }
                className="flex items-center w-full justify-between"
              >
                <div className="flex items-center">
                  <IconWrapper>{option.icon}</IconWrapper>
                  <span className="ml-3">{option.text}</span>
                </div>
                <ChevronRight className="h-4 w-4 ml-4" />
              </Button>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="px-2 py-2 ">
          <Link to="#" className="flex items-center" onClick={onLogoutClick}>
            <IconWrapper>
              <LogOut className="h-4 w-4 text-black" />
            </IconWrapper>
            <span className="ml-3">Cerrar sesión</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
