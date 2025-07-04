import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema, UserData } from "./FormEditSchema";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { baseURLCentralized } from "@/utils/constants";

interface Escuelas {
  id: number;
  id_facultad: number;
  codigo: string;
  nombre: string;
}

export function FormEditComp() {
  const { authState } = useAuth();
  const userId = authState.userId;
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [escuelas, setEscuelas] = useState<Escuelas[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      nombres: "",
      apellido_p: "",
      apellido_m: "",
      codigo: "",
      celular: "",
      id_escuela: 0,
      email: "",
      password: "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (userData) {
      form.reset(userData);
    }
    setIsEditing(false);
  };

  // Función para cargar escuelas
  const fetchEscuelas = async () => {
    try {
      const response = await fetch(
        `${baseURLCentralized}/escuelasprofesionales/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authState.accessToken}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar escuelas');
      }
      
      const dataEscuelas = await response.json();
      setEscuelas(dataEscuelas.results);
    } catch (error) {
      console.error("Error al cargar escuelas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las escuelas",
        variant: "destructive",
      });
    }
  };

  // Función para cargar datos del usuario
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${baseURLCentralized}/usuarios/${userId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authState.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar datos del usuario');
      }

      const data = await response.json();
      setUserData(data);
      
      // Resetear el formulario con los datos obtenidos
      form.reset({
        username: data.username || "",
        nombres: data.nombres || "",
        apellido_p: data.apellido_p || "",
        apellido_m: data.apellido_m || "",
        codigo: data.codigo || "",
        celular: data.celular || "",
        id_escuela: data.id_escuela || 0,
        email: data.email || "",
        password: data.password || "",
        codigoqr: data.codigoqr || "",
      });
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar escuelas al montar el componente
  useEffect(() => {
    fetchEscuelas();
  }, []);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Función para enviar los datos
  async function onSubmit(values: UserData) {
    try {
      const response = await fetch(
        `${baseURLCentralized}/usuarios/${userId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authState.accessToken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "Error al actualizar los datos");
      }

      // Actualizar el estado local con los nuevos datos
      const updatedData = { ...userData, ...values };
      setUserData(updatedData);
      
      // Resetear el formulario con los datos actualizados
      form.reset(updatedData);
      
      setIsEditing(false);
      
      toast({
        title: "Datos actualizados ✅",
        description: "Los datos se han actualizado correctamente",
      });
    } catch (error) {
      console.error("Error en el envío:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar los datos",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-6 self-stretch"
      >
        <div className="flex flex-col gap-6 self-stretch sm:gap-12 sm:flex-row">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de usuario"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombres"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex flex-col gap-6 self-stretch sm:gap-12 sm:flex-row">
          <FormField
            control={form.control}
            name="apellido_p"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Apellido Paterno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Apellido Paterno"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido_m"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Apellido Materno"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex flex-col gap-6 self-stretch sm:gap-12 sm:flex-row">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Código institucional</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Código institucional"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número de celular"
                    disabled={!isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="id_escuela"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Escuela Profesional</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={!isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu escuela" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {escuelas.map((escuela) => (
                    <SelectItem key={escuela.id} value={escuela.id.toString()}>
                      {escuela.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="codigoqr"
          render={({ field }) => (
            <FormItem className="self-stretch">
              <FormLabel>Código QR</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Código"
                  disabled={!isEditing}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="self-stretch">
              <FormLabel>Correo institucional</FormLabel>
              <FormControl>
                <Input
                  placeholder="Correo institucional"
                  disabled={!isEditing}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="self-stretch">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Contraseña"
                    type="password"
                    disabled={true}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          {isEditing ? (
            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-secondaryLight hover:bg-[rgba(0,54,105,0.9)]"
              >
                Guardar datos
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-secondaryLight text-secondaryLight"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEdit}
              className="bg-secondaryLight hover:bg-[rgba(0,54,105,0.9)]"
            >
              Editar datos
            </Button>
          )}
          <p className="text-[#555] mt-4 text-sm font-medium">
            Recuerda que solo puedes editar datos que no formen parte de tu
            organización.
          </p>
        </div>
      </form>
    </Form>
  );
}