import { getImage } from "../api/apiImages";

export const LoadImageMajor = async (id_articulo: number) => {
    const response = await getImage(id_articulo);
    return response.data.results; // Devuelve todas las imagen del articulo
};
