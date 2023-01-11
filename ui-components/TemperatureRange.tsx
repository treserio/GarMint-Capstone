import React, { useEffect, useRef } from 'react'
import NextImage from 'next/image'

import blazingSun from '../public/assets/icons/sm-blazingSun.png'
import cloudySun from '../public/assets/icons/sm-cloudySun.png'
import blowingCloud from '../public/assets/icons/sm-blowingCloud.png'
import snowflake from '../public/assets/icons/sm-snowflake.png'

// low, setLow, high, setHigh are from useState of parent
export default function TemperatureRange ({
  low,
  setLow,
  high,
  setHigh,
  min,
  max,
  width
} : {
  low: any,
  setLow: any,
  high: any,
  setHigh: any,
  min: number,
  max: number,
  width: any
}) {

  const lowDisplay = useRef<HTMLOutputElement>(null)
  const highDisplay = useRef<HTMLOutputElement>(null)

  // max - min, should come from props
  const range = max - min
  // console.log(low, high)

  useEffect(() => {
    // preload image
    const bs = <NextImage src= {blazingSun} alt='blazing sun' />
    const cs = <NextImage src= {cloudySun} alt='cloudy sun' />
    const bc = <NextImage src= {blowingCloud} alt='blowing cloud' />
    const sn = <NextImage src= {snowflake} alt='snowflake' />

    if (lowDisplay.current) {
      const newShift = ((low - min) / range) * 100
      lowDisplay.current.innerHTML! = low
      lowDisplay.current.style.left = `calc(${newShift}% + (${6 - newShift * 0.3}px))`
    }
    if (highDisplay.current) {
        const newShift = ((high - min) / range) * 100
        highDisplay.current.innerHTML! = high
        if (high === max) {
          highDisplay.current.style.left = `calc(${newShift}% + (${1.5 - newShift * 0.3}px))`
        } else {
          highDisplay.current.style.left = `calc(${newShift}% + (${6 - newShift * 0.3}px))`
        }
    }
  })

  const changeLow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue: number = e.target.valueAsNumber
    // alter the icon based on the current value
    if (targetValue < high) {
      if (targetValue >= 83 && low < 83) e.target.style.setProperty('--lowUrl', 'url(/assets/icons/sm-blazingSun.png)')
      if ((targetValue < 83 && low >= 83) || (targetValue >= 66 && low < 66)) e.target.style.setProperty('--lowUrl', 'url(/assets/icons/sm-cloudySun.png)')
      if ((targetValue < 66 && low >= 66) || (targetValue >= 49 && low < 49)) e.target.style.setProperty('--lowUrl', 'url(/assets/icons/sm-blowingCloud.png)')
      if (targetValue < 49 && low >= 49) e.target.style.setProperty('--lowUrl', 'url(/assets/icons/sm-snowflake.png)')
      // set the display value
      if (lowDisplay.current) {
        setLow(targetValue)
      }
    } else {
      setLow(high - 1)
    }
  }

  const changeHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue: number = e.target.valueAsNumber
    // alter the icon based on the current value
      if (targetValue > low) {
      if (targetValue >= 83 && high < 83) e.target.style.setProperty('--highUrl', 'url(/assets/icons/sm-blazingSun.png)')
      if ((targetValue < 83 && high >= 83) || (targetValue >= 66 && high < 66)) e.target.style.setProperty('--highUrl', 'url(/assets/icons/sm-cloudySun.png)')
      if ((targetValue < 66 && high >= 66) || (targetValue >= 49 && high < 49)) e.target.style.setProperty('--highUrl', 'url(/assets/icons/sm-blowingCloud.png)')
      if (targetValue < 49 && high >= 49) e.target.style.setProperty('--highUrl', 'url(/assets/icons/sm-snowflake.png)')
      // set the display value
      if (highDisplay.current) {
        setHigh(targetValue)
      }
    } else {
      setHigh(low + 1)
    }
  }

  const styleBar: React.CSSProperties = {
    position: 'absolute',
    height: '0px',
    borderTop: 'var(--burntOrange) 2.5px solid',
    width: width - 20,
    marginLeft: '10px',
  }

  const midSize = (high - low) / 68
  const midShift = (low - min) / range * 98
  const styleMid: React.CSSProperties = {
    position: 'absolute',
    height: '0px',
    borderTop: 'var(--mint) 1.5px solid',
    borderBottom: 'var(--mint) 1.5px solid',
    backgroundColor: 'var(--mint)',
    width: (width - 20) * midSize - 3,
    left: `calc(${midShift}% + (${10 - midShift * 0.18}px))`,
  }

  return (
    <div className='tempSetter w-full relative mt-2 mb-5'>
      <div style={styleBar} />
      <div style={styleMid} />
      <input
        id='lowTemp'
        className='tempSlider'
        type='range'
        value={low}
        min={min}
        max={max}
        style={{width}}
        onChange={changeLow}
      />
      <output className='absolute top-2' ref={lowDisplay}>{low}</output>
      <input
        id='highTemp'
        className='tempSlider'
        type='range'
        value={high}
        min={min}
        max={max}
        style={{width}}
        onChange={changeHigh}
      />
      <output className='absolute top-2' ref={highDisplay}>{high}</output>
    </div>
  )
}
