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
  const [userData, setUserData] = useState<UserData>();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset(userData);
    setIsEditing(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: userData ?? {
      username: "",
      nombres: "",
      apellido_p: "",
      apellido_m: "",
      codigo: "",
      celular: "",
      id_escuela: 0,
      email: "",
      password: "",
      codigoqr: "", // Campo opcional como string vacío
    },
  });

  useEffect(() => {
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
        const dataEscuelas = await response.json();
        setEscuelas(dataEscuelas.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEscuelas();
  }, []);

  const fetchData = async () => {
    try {
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
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchData();
    }
    form.reset(userData);
  }, [userData]);

  // Función para preparar los datos antes del envío
  const prepareDataForSubmit = (values: UserData) => {
    const submitData = { ...values };
    
    // Remover el campo codigoqr si está vacío
    if (!submitData.codigoqr || submitData.codigoqr === "") {
      delete submitData.codigoqr;
    }
    
    // Remover el campo password si está vacío (ya que está deshabilitado)
    if (!submitData.password || submitData.password === "") {
      delete submitData.password;
    }
    
    return submitData;
  };

  // 2. Define a submit handler.
  async function onSubmit(values: UserData) {
    try {
      // Preparar los datos eliminando campos problemáticos
      const dataToSubmit = prepareDataForSubmit(values);
      
      console.log("Datos a enviar:", dataToSubmit); // Para debugging
      
      const response = await fetch(
        `${baseURLCentralized}/usuarios/${userId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authState.accessToken}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData); // Para debugging
        throw new Error(errorData.message ?? "Error en actualizar los datos");
      }
      
      const updatedData = await response.json();
      
      toast({
        title: "Datos actualizados ✅",
      });
      
      // Actualizar el estado local con los datos actualizados
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error en el envio: ", error);
      toast({
        title: "Error al actualizar",
        description: "Hubo un problema al actualizar los datos. Intenta nuevamente.",
        variant: "destructive",
      });
    }
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
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger disabled={!isEditing}>
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
              <FormLabel>Código QR (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="https://ejemplo.com/mi-qr-code.jpg"
                  disabled={!isEditing}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500 mt-1">
                Ingresa la URL de tu código QR (opcional)
              </p>
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