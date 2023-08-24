import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiCliente';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';



type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean; 
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nexauth.token')
    Router.push('/')
  } catch {
    console.log('Erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@nexauth.token': token } = parseCookies();

    if (token) {
      fetchUserData(token); // Chame a função para buscar os dados do Power BI
    }
  }, []);

  async function fetchUserData(token: string) {
    try {
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { id, name, email } = response.data;
      setUser({ id, name, email });
    } catch {
      signOut();
    }
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password,
      });

      const { id, name, token } = response.data;


      setCookie(undefined, '@nexauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // expira em 1 mês
        path: '/dashboardPage', // quais caminhos terão acesso ao cookie
      });

      setUser({ id, name, email });
      

      api.defaults.headers['Authorization'] = `Bearer ${token}`;


      Router.push('/dashboardPage');
    } catch (err) {
      console.log('Erro ao acessar', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}
