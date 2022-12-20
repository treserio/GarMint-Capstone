import getAuthProps from '../scripts/getAuthProps'
import { useRouter } from 'next/router'

function Protected({ authenticated, username }: { authenticated: boolean; username: String }) {
  const router = useRouter()
  if (authenticated) {
    return <h1>Hello {username} from SSR route!</h1>

  }
  router.push('/')
}

export const getServerSideProps = getAuthProps

export default Protected
