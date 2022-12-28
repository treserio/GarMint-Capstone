import { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/appContext'


export default function Test(props: any) {
  const { appContext } = useContext(AppContext)
  const [garmintCount, setGarmintCount] = useState(appContext.garmintCount)

  console.log('init test', appContext.garmintCount)
  // console.log('test state', appState)
  setTimeout(() => console.log('delayed', appContext.garmintCount, appContext.bottoms, garmintCount), 1000)

  useEffect(() => {
    // have to pass the setGarmintCount to ensure this component re-renders on change
    if (appContext.garmintCount === 0) appContext.getUserGarmints(setGarmintCount)
  })

  return (
    <>
      {appContext.garmintCount != 0 &&
        appContext.bottoms.map((item) => (<div key={item.owner_id + item.item_number.toString()}>{item.styles}</div>))
      }
      {props.children}
    </>
  )
}
