import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { Amplify } from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure({ ...config, ssr: true })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className='bg-red-300'>
        <Link href="/">
          <span className='bg-green-300'>Home</span>
        </Link>
        <Link href="/profile">
          <span className='bg-orange-300'>Profile</span>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

// const linkStyle = css`
//   margin-right: 20px;
//   cursor: pointer;
// `

// const navStyle = css`
//   display: flex;
// `
