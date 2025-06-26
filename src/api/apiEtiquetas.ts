import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/etiquetas`;


export interface Etiqueta{
    id:number,
    nombre:string,
    descripcion:string,
}

const etiquetasApi = axios.create({
    baseURL: `${baseURL}` 
});

export const getEtiquetas = () => {
    return etiquetasApi.get('/');
}