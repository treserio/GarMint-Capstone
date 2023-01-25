// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { card } from '@aws-amplify/ui/dist/types/theme/tokens/components/card'
import React, { forwardRef, MouseEvent, useEffect, useRef } from 'react'
import CardItem from './CardItem'
import GarMint from '../models/garmint'

interface PropsInterface {
  id: string
  items: Array<GarMint>
}

const GarmintSlider = forwardRef((
  props: PropsInterface,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      id={props.id}
      ref={ref}
      data-mouse-down-at='0'
      data-prev-percentage='-50'
      data-percentage='0'
      draggable={false}
    >
      {props.items.map((item) => {
        return <CardItem garmint={item} key={`${item.item_number}`} />
      })}
    </div>
  )
})


export default GarmintSlider
