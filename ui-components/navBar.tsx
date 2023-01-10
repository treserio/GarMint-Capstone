import React, { useState, useEffect } from 'react'
// import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from 'react-icons/Linki';
import Image from 'next/image';
import mintLeaf from '../public/assets/mintLeaf.png'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faCalendarDays, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import ProfileCard from './ProfileCard';
import { Auth } from '@aws-amplify/auth'
import AppContext, { AppInfo } from '../contexts/appContext'
import { useRouter } from 'next/router';

const appInfo = new (AppInfo)

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [user, setUser] = useState(null)
    const [appContext, setAppContext] = useState(appInfo)
    const router = useRouter()

    console.log(nav);
    const handleNav = () => {
        setNav(!nav);
    }

    return (
        <>
            <div className="w-full h-32 shadow-xl shadow-green-400 " id="Navbar">
                <div className="flex justify-between  items-center w-full h-full px-3 2xl:px-16" >
                    <div className=''>
                        <Image src={'/assets/profile_HST.jpg'} alt="Tofer" width={40} height={40} className='rounded-full' />
                    </div>
                    <div className='hidden md:flex sm:justify-end'>

                        <button onClick={async () => {
                            await Auth.signOut()
                            setUser(null)
                            setAppContext(new AppInfo())
                            router.push('/')
                        }}><FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon></button>
                    </div>
                    {/* Hamburger Icon */}
                    <div
                        onClick={handleNav}
                        className='md:hidden'
                    >
                        <FontAwesomeIcon icon={faBars} className='ml-10 text-sm' />
                    </div>

                </div>
            </div>
            {/* Mobile Menu */}
            {/* Overlay */}

            {/* sidebar */}
            {console.log(nav)}
            <div
                className={
                    nav
                        ? 'md:hidden fixed left-0 top-0 w-3/4 h-screen bg-green-400 z-10'
                        : 'hidden'
                } >
                <ProfileCard />
                {/* <div className='flex justify-between items-center w-full h-16 px-3 2xl:px-16'>

                    <div
                        style={{ color: '#fff' }}
                        onClick={handleNav}
                        className='md:hidden'
                    >
                    </div>
                    <Link href="/" type=''>
                        <FontAwesomeIcon icon={faGear} className='ml-10 text-sm text-gray' />
                    </Link>
                </div>
                <ul className='flex flex-col justify-center items-center h-full'>
                    <li className='text-2xl text-white font-bold my-4'>
                        <Link href="/#Profile" type=''>
                            Profile
                            <FontAwesomeIcon icon={faUser} className='ml-10 text-sm text-gray' />
                        </Link>
                    </li>
                    <li className='text-2xl  font-bold my-4'>
                        <Link href="/#Calender" type=''>
                            Calender
                            <FontAwesomeIcon icon={faCalendarDays} className='ml-10 text-sm text-gray' />
                        </Link>
                    </li>
                </ul> */}
            </div>
        </>
    )
}

export default Navbar;
