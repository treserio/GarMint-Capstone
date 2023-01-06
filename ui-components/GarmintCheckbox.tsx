import React, { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

// forward the ref from parent to perform necessary actions with parent
const GarmintCheckbox = forwardRef((
  { label }: { label: string },
  ref: React.ForwardedRef<HTMLInputElement | null>
) => {
  let id: string = ''
  const wordList: Array<string> = label.split(' ')
  // smush label together with lowercase first word
  if (wordList.length === 1) id = label.toLowerCase()
  else {
    id += wordList.shift()?.toLowerCase()
    id += wordList.map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join('')
  }

  return (
    <div className='garmintCheckbox'>
      <input
        type='checkbox'
        id={id}
        value={id}
        ref={ref}
        hidden={true}
      />
      <div>
        <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
        <label
          htmlFor={id}
          className='rounded-full px-3 py-1'
        >
          {label}
        </label>
      </div>
    </div>
  )
})

export default GarmintCheckbox
