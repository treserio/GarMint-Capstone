import React from 'react';
// import Link from 'next/image';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const thing = 'data:image/webp;base64,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'

const CardItem = () => {
  return (
    <div style={{position: 'relative', width: '200px', height: '350px'}}>
      <img
        src={thing}
        alt="image"
        draggable={false}
        data-op={0.5}
      />
      <button className="card"
        style={{
          width: "35px",
          color: 'black',
          opacity: 0.8,
          position: 'absolute',
          bottom: 15,
          right: 15
        }}
        onClick={() => console.log('clicked')}
      >
        {/* will need to figure out where we wont to redirect posiable strech goal */}
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>
    </div>
  )
}

export default CardItem;
