import { createContext } from 'react'

class junk {
  user: any
  setter: any
}

const thing = new junk()

const AuthContext = createContext(
  thing
)

export default AuthContext
