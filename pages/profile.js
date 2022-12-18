import { useState, useEffect } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css';

function Profile() {
  const [user, updateUser] = useState(null)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('User:', user)
        updateUser(user)
      })
      .catch(err => updateUser(null))
  }, [])

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h2>hello, {user.email}</h2>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}

export default Profile
