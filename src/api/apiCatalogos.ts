import { baseURLCentralized } from '@/utils/constants';
import axios from 'axios';

export const baseURL = `${baseURLCentralized}/catalogos`;

const catalogosApi = axios.create({
    baseURL: `${baseURL}` 
});

export const getCatalogoUser= (id_usuario:number) => {
    return catalogosApi.get(`/?id_usuario=${id_usuario}`);
}

export const getCatalogoById= (id:number) => {
    return catalogosApi.get(`/${id}`);
}