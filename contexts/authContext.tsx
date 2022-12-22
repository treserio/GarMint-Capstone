import { createContext } from 'react'

class authorizedUser {
  user: any
  setter: any
}

export default createContext(
  new authorizedUser()
)
