import { createContext } from 'react'

class AuthInfo {
  user: any
  setUser: Function

  constructor() {
    this.user = null
    this.setUser = () => {}
  }
}

export default createContext(new AuthInfo())
