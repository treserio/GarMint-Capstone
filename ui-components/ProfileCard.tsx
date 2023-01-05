import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

// need to pull user data from database for avatar and username
// look into conecting calendar to google calendar

function ProfileCard() {
    return (
        <>
            <div className="flex items-center h-screen w-full justify-center">

                <div className="max-w-xs">
                    <div className="bg-white shadow-xl rounded-lg py-3">
                        <div className="photo-wrapper p-2">
                            <Image className="w-32 h-32 rounded-full mx-auto" src="https://esoteric918.github.io/static/media/me.ad0e663ab8f3044ba25d.jpg" alt="Tofer"></Image>
                        </div>
                        <div className="p-2">
                            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">USER NAME</h3>
                            <div className="text-center text-gray-400 text-xs font-semibold">

                            </div>
                            <table className="text-xs my-3">
                                <tbody><tr>
                                    <td className="px-2 py-2 text-gray-500 font-semibold">Calendar</td>
                                    <Link href="/">
                                        <td className="px-2 py-2"><FontAwesomeIcon icon={faCalendarDays} className='ml-10 text-sm text-gray' /></td>
                                    </Link>
                                </tr>
                                    <tr>
                                        <td className="px-2 py-2 text-gray-500 font-semibold">Settings</td>
                                        <td className="px-2 py-2"><FontAwesomeIcon icon={faGear} className='ml-10 text-sm text-gray' /></td>
                                    </tr>
                                </tbody></table>

                            <div className="text-center my-3">
                                <Link className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" href="#">View GarMints</Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProfileCard
