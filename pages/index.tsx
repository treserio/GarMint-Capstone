import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import AuthContext from '../contexts/authContext'
import { Authenticator } from '@aws-amplify/ui-react'
import { useContext } from 'react'
import FirstTimeLoginInput from './first_time_login'

export default function Home() {
  const { user, setUser } = useContext(AuthContext)
  // const [ garmintCount, setGarmintCount ] = useState(appContext.garmintCount)

  // useEffect(() => {
  //   appContext.getUserGarmints(setGarmintCount)
  // }, [user])

  return (
    <>
      {user ? <FirstTimeLoginInput />
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
