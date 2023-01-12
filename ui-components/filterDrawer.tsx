import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function FilterDrawer() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);



    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <>

                <div className={
                    isDrawerOpen
                    ? "hidden"
                    : "text-center bottom-0 left-0 right-0 transform-none absolute"
                    }>
                <button
                    onClick={toggleDrawer}
                    className="text-white z-40 w-full bg-gray-200 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-md dark:bg-[var(--mint-faded)] dark:hover:bg[var(--mint-primary)] focus:outline-none " type="button" data-drawer-target="drawer-bottom-example" data-drawer-show="drawer-bottom-example" data-drawer-placement="bottom" aria-controls="drawer-bottom-example">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* <!-- drawer component --> */}
            <div id="drawer-bottom"
                className={
                    isDrawerOpen

                        ? "fixed z-40 w-full p-4 overflow-y-auto bg-white dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 transform-none"
                        : "hidden"
                } >

                <button>
                    <FontAwesomeIcon icon={faClose} onClick={toggleDrawer} />
                </button>

                <div className="flex justify-between items-center">
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200 dark:shadow-md dark:shadow-slate-300" onClick={() => {}}>Filters???</button>
                </div>
            </div>
        </>
    )
}

export default FilterDrawer
