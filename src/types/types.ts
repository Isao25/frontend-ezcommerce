export type Usuario={
  id?:number,
  id_escuela:number,
  username:string,
  email:string,
  nombres:string,
  apellido_p:string,
  apellido_m:string,
  celular:string,
  codigo:string,
  fecha_nacimiento?:string,
  codigo_qr?:string|FileList|null,
}

export type EscuelaProfesional={
  id?:string,
  id_facultad:string,
  codigo:string,
  nombre:string,
}

export type Marca={
  id?:number,
  id_usuario:number,
  nombre:string,
  descripcion:string,
  logo:string|FileList
}
export type Plan={
  id?:number,
  nombre:string,
  descripcion:string,
  espacio_extra:number,
  duracion:number,
  precio:number,
  beneficios?:string[],
}
export type Membresia={
  id?:number,
  id_marca:number,
  id_plan:number,
  fecha_inicio:string,
  fecha_final:string,
}

export type DecodedToken ={
  user_id: number;
}
export type Tokens ={
  access: string;
  refresh: string;
}
export type AuthState ={
  accessToken: string | null;
  userId: number | null;
}
export type APIResponse ={
  results: EscuelaProfesional[];               
}

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: types.ts
 * Ruta: 
 * Tamaño: 1028 bytes
 * Líneas totales:       59
 * Líneas no vacías: 56
 * Caracteres:     1028
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📤 EXPORTS:
 *   - export type APIResponse ={
 *   - export type AuthState ={
 *   - export type DecodedToken ={
 *   - export type EscuelaProfesional={
 *   - export type Marca={
 *   - export type Membresia={
 *   - export type Plan={
 *   - export type Tokens ={
 *   - export type Usuario={
 * 
 * 🔖 TIPOS:
 *   - export type APIResponse ={
 *   - export type AuthState ={
 *   - export type DecodedToken ={
 *   - export type EscuelaProfesional={
 *   - export type Marca={
 *   - export type Membresia={
 *   - export type Plan={
 *   - export type Tokens ={
 *   - export type Usuario={
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 0
 *   - Ratio código/comentarios: 56.00
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
