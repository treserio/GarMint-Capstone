import getAuthProps from '../scripts/getAuthProps'
import { useRouter } from 'next/router'
import AppContext from '../contexts/appContext';
import { useContext } from 'react'

function Protected({ authenticated, username }: { authenticated: boolean; username: String }) {
  const appContext = useContext(AppContext)
  const router = useRouter()

  console.log(appContext.garmintCount)
  if (authenticated) {
    return <h1>Hello {username} from SSR route!</h1>
  }
  router.push('/')
}

export const getServerSideProps = getAuthProps

export default Protected
