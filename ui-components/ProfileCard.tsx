import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import  AuthContext  from '../contexts/authContext'
import AppContext from '../contexts/appContext'
import { useContext, useState, useEffect } from 'react'
// need to pull user data from database for avatar and username
// look into conecting calendar to google calendar


function ProfileCard() {
    const { user } = useContext(AuthContext)
    const { appContext } = useContext(AppContext)
    const [ garmintCount, setGarmintCount ] = useState(appContext.garmintCount)

    useEffect(() => {
        appContext.getUserGarmints(setGarmintCount)
    }, [appContext])

    return (
        <>
            <div className="flex h-screen w-full ">

                <div className="">
                    <div className="bg-white shadow-xl rounded-lg py-3">
                        <div className="photo-wrapper p-2">
                            <Image className="w-32 h-32 rounded-full mx-auto" src={"/assets/profile_HST.jpg"} alt="Tofer" width={10} height={10}></Image>
                        </div>
                        <div className="p-2">
                            <h3 className="text-center text-xl text-gray-900 font-medium leading-8"> <p>{user.attributes.preferred_username}</p>  </h3>
                            <div className="text-center text-gray-400 text-xs font-semibold">

                            </div>
                            <table className="text-xs my-3">
                                <tbody><tr>
                                    <td className="px-2 py-2 text-gray-500 font-semibold">Calendar</td>
                                    <Link href="/">
                                        <td className="px-2 py-2"><FontAwesomeIcon icon={faCalendarDays} className='ml-10 text-sm text-gray' /></td>
                                    </Link>
                                </tr>
                                </tbody></table>

                            <div className="text-center my-3">
                                <p className="text-xs font-medium justify-evenly" >
                                    GarMint Count:
                                    {garmintCount}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProfileCard
