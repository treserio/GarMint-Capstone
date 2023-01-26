import React, { useContext, useState } from 'react'
import AppContext, { AppInfo } from '../contexts/appContext'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import GarMint from '../models/garmint'
import { NodeNextRequest } from 'next/dist/server/base-http/node'

const CardItem = ({ garmint }: { garmint: GarMint }) => {
  const { appContext, setAppContext } = useContext(AppContext)

  const [confirmDel, setConfirmDel] = useState(false)

  // function to toggle delete state, run following with confirm button

  const deleteMe = (owner_id: String, item_number: number) => {
    // Needs Confirmation message, based on state
    // if del is true, delete garmint
    const params = {
      TableName: 'garmints',
      Key: {
        owner_id,
        item_number
      }
    }
    appContext.db.delete(params, (err, data) => {
      // if err exit without doing anything
      if (err) return console.log(err)
      const idx = appContext.garmints.indexOf(garmint)
      if (idx > -1) {
        appContext.garmints.splice(idx, 1)
      }
      const newContext = new AppInfo()
      setAppContext(Object.assign(newContext, appContext))
    })

  }

  return (
    <div
      // key={`${garmint.item_number}`}
      className='cardItem'
      style={{
        position: 'relative',
        width: '200px',
        height: '350px'
      }}
    >
      <img
        src={garmint.image}
        alt={`garmint${garmint.item_number}`}
        draggable={false}
        data-op={0.5}
      />
      <FontAwesomeIcon
        className='
          text-[var(--burntOrange)]
          text-xl
          absolute
        '
        style={{
        top: 0,
        right: 0
        }}
        onClick={() => deleteMe(garmint.owner_id, garmint.item_number)}
        icon={faWindowClose}
      />
      <button
        className='
          text-[var(--mint)]
          text-xl
          absolute
        '
        style={{
          bottom: 15,
          right: 15
        }}
        onClick={() => console.log('cart clicked')}
      >
        {/* will need to figure out where we wont to redirect possible strech goal */}
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>
    </div>
  )
}

export default CardItem;
