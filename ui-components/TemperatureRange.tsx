import React, { forwardRef, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

// forward the ref from parent to perform necessary actions with parent
const TemperatureRange = ({ low, setLow, high, setHigh, width }:
  { low: any, setLow: any, high: any, setHigh: any, width: any }) => {

  const lowDisplay = useRef<HTMLElement>(null)
  const highDisplay = useRef<HTMLElement>(null)
  const range = 100 - 32
  console.log(low, high)

  const changeLow = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (lowDisplay.current) {
      if (e.target.valueAsNumber < high) {
        const newShift = ((e.target.valueAsNumber - 32) / range) * 100
        lowDisplay.current.innerHTML! = e.target.value
        lowDisplay.current.style.left = `calc(${newShift}% + (${ - newShift * 0.18}px))`
        setLow(e.target.valueAsNumber)
      }
    }
  }

  const changeHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (highDisplay.current) {
      if (e.target.valueAsNumber > low) {
        const newShift = ((e.target.valueAsNumber - 32) / range) * 100
        highDisplay.current.innerHTML! = e.target.value
        highDisplay.current.style.left = `calc(${newShift}% + (${ - newShift * 0.18}px))`
        setHigh(e.target.valueAsNumber)
      }
    }
  }

  return (
    <div className='tempSetter w-full relative mt-2 mb-5'>
      <input
        id='lowTemp'
        className='thumb'
        // className='absolute appearance-none pointer-events-none bg-transparent thumb'
        type='range'
        value={low}
        min={32}
        max={100}
        style={{width}}
        onChange={changeLow}
      />
      <output className='absolute top-4' ref={lowDisplay}>{low}</output>
      <input
        // className='absolute appearance-none pointer-events-none bg-transparent thumb'
        id='highTemp'
        className='thumb'
        type='range'
        value={high}
        min={32}
        max={100}
        style={{width}}
        onChange={changeHigh}
      />
      <output className='absolute top-4' ref={highDisplay}>{high}</output>
    </div>
  )
}

export default TemperatureRange
