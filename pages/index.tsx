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
  const { appContext, setAppContext } = useContext(AppContext)

  // useEffect(() => {
  //   console.log('running index effect')
  //   if (!appContext.weather) {
  //     appContext.getWeather()
  //   }
  // }, [user])
  console.log('garmintCount', appContext.garmintCount)
  return (
    <>
      {user ? user.attributes.preferred_username ? <Dashboard /> : <FirstTimeLoginInput />
      : <div className='grid h-screen place-items-center'>
          <Authenticator>
            {({ user }) => {
              setUser(user)
              appContext.getUserGarmints(setAppContext)
              return <></>
            }}
          </Authenticator>

        </div>
      }
    </>
  )
}
