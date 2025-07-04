import { createContext, ReactNode, useState, useEffect, useMemo } from "react";
import { Marca, Plan, Membresia } from "@/types";
import {
  membresiasService,
  planesService,
  marcasService,
} from "@/api/apiMarcas";
import { useAuth } from "@/hooks/useAuth";

interface TrademarkContextType {
  marca: Marca | null;
  setMarca: React.Dispatch<React.SetStateAction<Marca | null>>;
  membresia: Membresia | null;
  plan: Plan | null;
  gratisModal: boolean;
  setGratisModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrademarkContext = createContext<TrademarkContextType | null>(
  null
);

export const TrademarkProvider = ({ children }: { children: ReactNode }) => {
  const [marca, setMarca] = useState<Marca | null>(null);
  const [membresia, setMembresia] = useState<Membresia | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [gratisModal, setGratisModal] = useState<boolean>(false);
  
  const { authState } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.userId) {
        setMarca(null);
        setMembresia(null);
        setPlan(null);
        return;
      }
      
      try {
        const marcaResponse = await marcasService.getMarcaByUsuario(authState.userId);
        const fetchedMarca = marcaResponse?.data?.results?.[0] as Marca;
        if (!fetchedMarca) return;
        setMarca(fetchedMarca);

        const membresiaResponse = await membresiasService.getMembresiaByMarca(fetchedMarca.id!);
        const fetchedMembresia = membresiaResponse?.data?.results?.[0] as Membresia;
        if (!fetchedMembresia) return;
        setMembresia(fetchedMembresia);

        const planResponse = await planesService.getPlan(fetchedMembresia.id_plan);
        const fetchedPlan = planResponse?.data as Plan;
        if (!fetchedPlan) return;
        setPlan(fetchedPlan);
      } catch (error) {
       console.error(error)
      }
    };

    fetchData();
  }, [authState.userId]);

  // Memoiza el objeto del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(
    () => ({
      marca,
      setMarca,
      membresia,
      plan,
      gratisModal,
      setGratisModal,
    }),
    [marca, membresia, plan, gratisModal]
  );

  return (
    <TrademarkContext.Provider value={contextValue}>
      {children}
    </TrademarkContext.Provider>
  );
};




