import { z } from "zod";

export const formSchema = z.object({
  username: z.string(),

  nombres: z
    .string({ message: "Nombres inválidos" })
    .min(1, { message: "Nombres inválidos" })
    .max(200, { message: "Nombres deben tener como máximo 200 carácteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/, {
      message:
        "Formato inválido: solo letras, sin espacios al inicio/final ni múltiples espacios consecutivos",
    }),
  apellido_p: z
    .string({ message: "Apellidos inválidos" })
    .min(1, { message: "Apellidos inválidos" })
    .max(200, { message: "Apellidos deben tener como máximo 200 carácteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/, {
      message:
        "Formato inválido: solo letras, sin espacios al inicio/final ni múltiples espacios consecutivos",
    }),
  apellido_m: z
    .string({ message: "Apellidos inválidos" })
    .min(1, { message: "Apellidos inválidos" })
    .max(200, { message: "Apellidos deben tener como máximo 200 carácteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/, {
      message:
        "Formato inválido: solo letras, sin espacios al inicio/final ni múltiples espacios consecutivos",
    }),
  codigo: z
    .string({ message: "Código inválido" })
    .regex(/^\d+$/, { message: "El código debe contener solo números." })
    .min(8, { message: "Código inválido" })
    .max(8, { message: "Código debe tener como máximo 8 carácteres" }),
  celular: z
    .string({ message: "Celular inválido" })
    .regex(/^\+?\d+$/, { message: "El celular debe contener solo números." })
    .min(9, { message: "El celular debe tener al menos 9 dígitos" })
    .max(15, { message: "El celular debe tener como máximo 15 dígitos" }),
  id_escuela: z
    .number({
      required_error: "Seleccione una escuela",
      invalid_type_error: "Seleccione una escuela",
    })
    .min(1, { message: "Debe seleccionar una escuela" }),
  email: z
    .string({ message: "Email inválido" })
    .email({ message: "Email inválido" })
    .max(254, { message: "Email debe tener como máximo 254 caracteres" })
    .refine((email) => email.endsWith("@unmsm.edu.pe"), {
      message: "El email debe terminar con @unmsm.edu.pe",
    }),
  password: z
    .string({ message: "Contraseña inválida" })
    .min(6, { message: "Contraseña debe tener como mínimo 6 carácteres" }),
  codigoqr: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type UserData = z.infer<typeof formSchema>;
