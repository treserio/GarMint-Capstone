import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import GarmintCheckbox from "./GarmintCheckbox";

function FilterDrawer() {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // types
    const checkTop = useRef<HTMLInputElement>(null)
    const checkBottom = useRef<HTMLInputElement>(null)
    const checkOuter = useRef<HTMLInputElement>(null)
    // colors
    const checkBlack = useRef<HTMLInputElement>(null)
    const checkBlue = useRef<HTMLInputElement>(null)
    const checkBrown = useRef<HTMLInputElement>(null)
    const checkGreen = useRef<HTMLInputElement>(null)
    const checkGrey = useRef<HTMLInputElement>(null)
    const checkOrange = useRef<HTMLInputElement>(null)
    const checkPurple = useRef<HTMLInputElement>(null)
    const checkRed = useRef<HTMLInputElement>(null)
    const checkYellow = useRef<HTMLInputElement>(null)
    const checkWhite = useRef<HTMLInputElement>(null)
    const checkMulti = useRef<HTMLInputElement>(null)
    // style
    const checkSpring = useRef<HTMLInputElement>(null)
    const checkSummer = useRef<HTMLInputElement>(null)
    const checkFall = useRef<HTMLInputElement>(null)
    const checkWinter = useRef<HTMLInputElement>(null)
    const checkActive = useRef<HTMLInputElement>(null)
    const checkCasual = useRef<HTMLInputElement>(null)
    const checkFormal = useRef<HTMLInputElement>(null)
    const checkWork = useRef<HTMLInputElement>(null)
    const checkBusinessCasual = useRef<HTMLInputElement>(null)

    return (
        <>

            <div className={
                isDrawerOpen
                    ? "hidden"
                    : "text-center bottom-0 left-0 right-0 transform-none absolute"
            }>
                <button
                    onClick={toggleDrawer}
                    className="text-white z-40 w-full bg-gray-200 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 font-medium text-md dark:bg-[var(--mint-faded)] dark:hover:bg[var(--mint-primary)] focus:outline-none " type="button" data-drawer-target="drawer-bottom-example" data-drawer-show="drawer-bottom-example" data-drawer-placement="bottom" aria-controls="drawer-bottom-example">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* <!-- drawer component --> */}
            <div id="drawer-bottom"
                className={
                    isDrawerOpen

                        ? "fixed z-40 w-full h-3/4 p-4 overflow-y-auto bg-white dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 transform-none"
                        : "hidden"
                } >

                <button>
                    <FontAwesomeIcon icon={faClose} onClick={toggleDrawer} />
                </button>

                    <p className="text-2xl font-bold text-amber-900">Filter from </p>
                <div className="flex justify-around items-center mb-3 pb-2 border-b-4 border-amber-900">
                    <GarmintCheckbox ref={checkTop} label="Tops" />
                    <GarmintCheckbox ref={checkBottom} label="Bottom" />
                    <GarmintCheckbox ref={checkOuter} label='Outerwear' />
                </div>
                    <p className="text-2xl font-bold text-amber-900">Select Outfits with these colors</p>
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-2 mb-3 pb-2' >
                    <GarmintCheckbox ref={checkBlack} label='Black' />
                    <GarmintCheckbox ref={checkBlue} label='Blue' />
                    <GarmintCheckbox ref={checkBrown} label='Brown' />
                    <GarmintCheckbox ref={checkGrey} label='Grey' />
                    <GarmintCheckbox ref={checkYellow} label='Yellow' />
                    <GarmintCheckbox ref={checkWhite} label='White' />
                    <GarmintCheckbox ref={checkGreen} label='Green' />
                    <GarmintCheckbox ref={checkOrange} label='Orange' />
                    <GarmintCheckbox ref={checkPurple} label='Purple' />
                    <GarmintCheckbox ref={checkRed} label='Red' />
                    <GarmintCheckbox ref={checkMulti} label='Multicolored' />
                </div>
                {/* <div className='flex justify-between items-center mb-3 pb-2' >

                </div>
                <div className='flex justify-around items-center mb-3 pb-2 ' >

                </div> */}
                <p className="text-2xl font-bold text-[var(--burntOrange)]">Select Outfits for these seasons</p>
                <div className='grid grid-cols-3 mb-3 pb-2 border-b-4 gap-2 border-amber-900' >
                    <GarmintCheckbox ref={checkSpring} label='Spring' />
                    <GarmintCheckbox ref={checkSummer} label='Summer' />
                    <GarmintCheckbox ref={checkFall} label='Fall' />
                    <GarmintCheckbox ref={checkWinter} label='Winter' />
                </div>
                <p className="text-2xl font-bold text-amber-900">Select Outfits for these occasions</p>
                <div className='grid grid-cols-3 mb-3 pb-2 border-b-4 gap-2 border-amber-900' >
                    <GarmintCheckbox ref={checkActive} label='Active' />
                    <GarmintCheckbox ref={checkCasual} label='Casual' />
                    <GarmintCheckbox ref={checkFormal} label='Formal' />
                    <GarmintCheckbox ref={checkWork} label='Work' />
                    <GarmintCheckbox ref={checkBusinessCasual} label='Business Casual' />
                </div>
            </div>
        </>
    )
}

export default FilterDrawer
