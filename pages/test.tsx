import { useContext, useState, useEffect } from 'react'
import Image from "next/image"
import AppContext from '../contexts/appContext'


export default function Test(props: any) {
  const { appContext } = useContext(AppContext)

  console.log('init test', appContext.garmintCount)
  // console.log('test state', appState)
  setTimeout(() => console.log('delayed', appContext.garmintCount, appContext.tops), 1000)

  return (
    <>
      {appContext.garmintCount != 0 &&
        appContext.tops.map((item) => {
          if (item.image != 'something') {
            return <Image
              key={item.owner_id + item.item_number.toString()}
              width={414}
              height={736}
              src={item.image}
              alt={`${item.owner_id}`}
            />
          }
        })
      }
      {props.children}
    </>
  )
}
