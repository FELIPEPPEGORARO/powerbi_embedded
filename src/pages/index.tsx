import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../../styles/home.module.scss'
import logoImg from '../../public/header.svg'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { AuthContext } from '../contexts/AuthContext'
//import {GetServerSideProps} from 'next'
import { canSSRGuest } from '../utils/canSSRGuest'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { signIn } = useContext(AuthContext)

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent){
    event.preventDefault();

    if(email === '' || password === ''){

      alert("Por favor preencha os dados de Login")

    }

    setLoading(true);


    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false)

  }

  return (
    <>
    <Head>
      <title>
        Login KPI Seventh
      </title>
    </Head>
    
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <Input 
          placeholder='Digite seu e-mail'
          type='text'
          value={email}
          onChange={ (e) => setEmail(e.target.value)}
          />

          <Input 
          placeholder='Sua senha'
          type='password'
          value={password}
          onChange={ (e) => setPassword(e.target.value)}
          />

          <Button
          type='submit'
          loading={loading}
          >
            Entrar
          </Button>  
        </form>

        
      </div>


    </div>    
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
   

  return {
    props: {}
  }
})

