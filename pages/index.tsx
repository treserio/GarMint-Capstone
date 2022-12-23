import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import AuthContext from '../contexts/authContext'
import { Authenticator } from '@aws-amplify/ui-react'
import { useContext, useEffect, useState } from 'react'
import AppContext, { AppInfo } from '../contexts/appContext'
import Test from './test'


export default function Home() {
  const { user, setter } = useContext(AuthContext)
  const appInfo: AppInfo = new AppInfo()

  const [ appState, appStateSetter ] = useState(appInfo)
  useEffect(() => {
    if (user) {
      appInfo.getUserGarmints()
    }
  })


  return (
    <>
      {user ? <AppContext.Provider value={appState}>
        <Test>
          <p>bullshit</p>
        </Test>
      </AppContext.Provider>
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
