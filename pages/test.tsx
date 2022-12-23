import { useContext, useState } from 'react'
import AppInfo from '../contexts/appContext'

export default function Test(props: any) {
  const appInfo = useContext(AppInfo)
  const { bottoms } = useContext(AppInfo)
  // const [ appState, appStateSet] = useState(appInfo)
  const [ appState, appStateSet] = useState(bottoms)

  console.log('test context', appInfo.bottoms)
  console.log('test state', appState)
  setTimeout(() => console.log('delayed', appInfo.bottoms), 600)

  return (
    <>
      {appState &&
        appState.map((item) => {
          return <div>{item.styles}</div>
        })
      }
      {props.children}
    </>
  )
}
