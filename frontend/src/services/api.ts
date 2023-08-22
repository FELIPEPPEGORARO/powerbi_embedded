import axios, {AxiosError} from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenErro';
import { signOut } from '../contexts/AuthContext';


export function setupAPICliente(ctx = undefined){

    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: { 
            Authorization: `Bearer ${cookies['@nexauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    },
    (error:AxiosError) => {
        if(error.response?.status === 401){
            // qualquer error nao autorizado devemos deslogar o usuario
            if(typeof window === "undefined") {
                //chmar a função para deslogar
                signOut();
        }else{
            return Promise.reject(new AuthTokenError())
            }
        }
    
        return Promise.reject(error)
    })
        return api;
  }