import axios from 'axios';

export const baseURL = 'http://localhost:8000/articulos';

export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  etiquetas: number[];
  id_marca?: number;
  is_marca: boolean;
  id_catalogo: number;
  imageUrl?: string;
}

const articulosApi = axios.create({
  baseURL: `${baseURL}`,
});


articulosApi.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}");
    const accessToken = tokens?.access ?? null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("No access token found");
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error("Request interceptor error")
    );
  }
);

export const getArticulos = () => {
  return articulosApi.get('/');
}

export const createArticulo = (articulo: Articulo) => {
  return articulosApi.post('/', articulo);
};

export const updateArticulo = (id: number, articulo: Articulo) => {
  return articulosApi.put(`/${id}/`, articulo);
}

export const deleteArticulo = (id: number) => {
  return articulosApi.delete(`/${id}/`);
};

export const getArticulo = (id: number) => {
  return articulosApi.get(`/${id}`);
}

export const getArticulosByUsuario = (usuarioId: number) => {
  return articulosApi.get(`/?id_catalogo__id_usuario=${usuarioId}`);
};

