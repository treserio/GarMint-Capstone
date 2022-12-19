import { useState, useEffect } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
// import '@aws-amplify/ui-react/styles.css'


function Login() {
  const [user, updateUser] = useState(null)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('User:', user.username)
        console.log(user)
        updateUser(user)
      })
      .catch(err => updateUser(null))
  }, [])

  return (
    <div className='grid h-screen place-items-center'>
        <Authenticator>
        {({ signOut, user }) => (
            <main>
            <h2>hello, {user!.attributes!.name}</h2>
            <button onClick={signOut}>Sign out</button>
            </main>
        )}
        </Authenticator>
    </div>
  )
}

export default Login
