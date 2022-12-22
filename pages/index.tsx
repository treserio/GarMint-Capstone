import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import AuthContext from '../contexts/authContext'
import { Authenticator } from '@aws-amplify/ui-react'
import { useContext } from 'react'
import garmintContext from '../contexts/garmintContext'


export default function Home() {
  const { user, setter } = useContext(AuthContext)
  const { wtf, temperature } = useContext(garmintContext)

  console.log(temperature)
  console.log(wtf())

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
