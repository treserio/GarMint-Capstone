import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import GarMint from '../models/garmint'

const CardItem = ({ garmint }: { garmint: GarMint }) => {
  return (
    <div
      // key={`${garmint.item_number}`}
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
        onClick={() => console.log('delete item from db confirmation')}
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
