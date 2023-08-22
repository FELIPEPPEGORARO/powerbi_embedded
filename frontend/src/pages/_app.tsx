import '../../styles/globals.scss'
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext'
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    import ('powerbi-client-react')
    
}, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider> 
  )
}
