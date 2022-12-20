import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import AuthContext from '../contexts/authContext'
import { Authenticator } from '@aws-amplify/ui-react'
import { useContext } from 'react'


export default function Home() {
  const { user, setter } = useContext(AuthContext)
  return (
    <>
      {user ? <p>finally</p>
      : <div className='grid h-screen place-items-center'>
          <Authenticator>
            {({ user }) => {
              setter(user)
              return <></>
            }}
          </Authenticator>
        </div>
      }
    </>
  )
}
