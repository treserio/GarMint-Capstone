import React from 'react';
// import Link from 'next/image';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';



const CardItem = () => {
    return (
        <div style={{position: 'relative', width: '350px', height: '350px'}}>
            <div className="card-image" style={{background: 'cover'}}>
                <Image
                    src="/assets/pic-article-01.jpg"
                    alt="image"
                    fill={true}
                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                    draggable={false}
                    />
            </div>
                <button className="card"
                    style={{
                        width: "35px",
                        color: 'black',
                        opacity: 0.8,
                        position: 'absolute',
                        bottom: 15,
                        right: 15}}
                    onClick={() => console.log('clicked')}>
                        {/* will need to figure out where we wont to redirect posiable strech goal */}
                        <FontAwesomeIcon icon={faShoppingCart}  />
                </button>
        </div>
    )
}

export default CardItem;
