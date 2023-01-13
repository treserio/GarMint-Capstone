// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { card } from '@aws-amplify/ui/dist/types/theme/tokens/components/card'
import React, { forwardRef, MouseEvent, useEffect, useRef } from 'react'
import CardItem from './cardItem'

interface PropsInterface {
  hmd: Function
  hmm: Function
  hmu: Function
}

const GarmintSlider = forwardRef((
  props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      id='card_track'
      ref={ref}
      data-mouse-down-at='0'
      data-prev-percentage='-50'
      data-percentage='0'
      draggable={false}
      // onMouseDown={e => props.hmd(e)}
      // onMouseMove={e => props.hmm(e)}
      // onMouseUp={e => props.hmu(e)}
    >
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
      <CardItem />
    </div>
  )
})


export default GarmintSlider
