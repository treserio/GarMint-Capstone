// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import React, { MouseEvent, useEffect, useRef } from 'react'
import CardItem from './cardItem'


function GarmintSlider() {
    const card_track = useRef(null)
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent> | TouchEvent) => {
        const hearMe = document.getElementById('card_track')
        console.log('hearMe', hearMe)

        console.log('card_track', card_track)

        card_track?.addEventListener('mousedown', (e) => {
            console.log('e', e)
        })

        // if (card_track.current){
        // // if (card_track!.current.dataset.mouseDownAt === '0') return;
        // console.log(e.type)
        // if (e.type ===  'mousedown' || e.type === 'touchstart') {

        //     console.log(card_track.current, 'that one')
        //     console.log(e.type, 'anything')
        //     const mouseDelta = parseFloat(card_track.current) - e.clientX,
        //         maxDelta = innerWidth / 2
        //     console.log(mouseDelta, 'anything')

        //     const percentage = (mouseDelta / maxDelta) * -100,
        //         nextPercentage = parseFloat(card_track.current) + percentage;
        //     console.log('percentage', percentage)
        //     console.log('nextPercentage', nextPercentage)
        //     console.log('style', card_track.style)
        //     // card_track.style = `translate(${percentage}%, -50%)`
        // }
        // }
    }


    return (


        <div id='card_track' ref={card_track} data-mouse-down-at='0' data-prev-percentage='0'
            onMouseDown={e => handleMouseDown(e)}>
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
}

export default GarmintSlider
