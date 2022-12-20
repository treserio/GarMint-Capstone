import { withSSRContext } from 'aws-amplify'

export default async function getAuthProps(
    {req, res}: { req: any, res: any }
  ) {
  const { Auth } = withSSRContext({ req })
  try {
    console.log('in AuthProps')
    const user = await Auth.currentAuthenticatedUser()
    console.log(user.attributes.name)
    await Auth.updateUserAttributes(user, {
      preferred_username: 'charley',
      'custom:use_limit': '3',
      'custom:wash_cycle': '30',
    })
    const user2 = await Auth.currentAuthenticatedUser()
    console.log('after user:', user2.attributes)
    return {
      props: {
        authenticated: true,
        username: user.attributes.name
      }
    }
  } catch (err) {
    console.log('in err', err)
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  return {props: {}}
}
