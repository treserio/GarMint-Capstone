import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import AuthContext from '../contexts/authContext'
import AppContext from '../contexts/appContext'
import { Authenticator } from '@aws-amplify/ui-react'
import { useContext, useState, useEffect } from 'react'
import FirstTimeLoginInput from './first_time_login'
import Test from './test'
import Dashboard from './dashboard'

export default function Home() {
  const { user, setUser } = useContext(AuthContext)
  const { appContext } = useContext(AppContext)
  const [ garmintCount, setGarmintCount ] = useState(appContext.garmintCount)

<<<<<<< HEAD
  // useEffect(() => {
  //   appContext.getUserGarmints(setGarmintCount)
  // }, [user])
=======
//   useEffect(() => {
//     appContext.getUserGarmints(setGarmintCount)
//   }, [user])
>>>>>>> working on carousel

  return (
    <>
      {user ? user.attributes.preferred_username ? <Dashboard /> : <FirstTimeLoginInput />
      : <div className='grid h-screen place-items-center'>
          <Authenticator>
            {({ user }) => {
              setUser(user)
              return <></>
            }}
          </Authenticator>

        </div>
      }
    </>
  )
}
