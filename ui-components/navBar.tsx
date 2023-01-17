import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import ProfileCard from './ProfileCard';
import { Auth } from '@aws-amplify/auth'
import AppContext, { AppInfo } from '../contexts/appContext'
import { useRouter } from 'next/router';
import AuthContext from "../contexts/authContext"
import GarMint from '../models/garmint';
import GarmintCam  from './GarmintCam';

const appInfo = new (AppInfo)

const Navbar = () => {
	const { user, setUser } = useContext(AuthContext)
	const { appContext, setAppContext } = useContext(AppContext)
	const [nav, setNav] = useState(false);
	let seasonTops = []
	let seasonBottoms = []
	let dirtyTops = []
	let dirtyBottoms = []
	let washPercent = 0

	const router = useRouter()

	useEffect(() => {
		appInfo.getUserGarmints(setAppContext)
		const season = "fall"

		seasonTops = appContext.tops.filter(item =>
			item.styles.includes(season) && item.uses > item.worn
		)
		seasonBottoms = appContext.bottoms.filter(item =>
			item.styles.includes(season) && item.uses > item.worn
		)
		dirtyTops = appContext.tops.filter(item =>
			 item.uses === item.worn
		)
		dirtyBottoms = appContext.bottoms.filter(item =>
			item.uses === item.worn
		)

		if (seasonTops.length || seasonBottoms.length) {
			washPercent = Math.round((dirtyTops.length + dirtyBottoms.length) / (appContext.tops.length + appContext.bottoms.length) * 100)
		}

})

	console.log(nav);
	const handleNav = () => {
		setNav(!nav);
	}

	return (

		<div className="w-full h-32 shadow-xl shadow-green-400 dark:shadow-xl dark:shadow-green-300 bg-lime-800 dark:bg-slate-700" id="Navbar">
			<div className="flex w-full h-full px-3 2xl:px-16" >
				<div className='item-center pr-3'>
					<Image src={'/assets/profile_HST.jpg'} alt="Tofer" width={75} height={65} className='rounded-full mt-5' />
				</div>
				<div className='grid grid-rows-3 grid-flow-col gap-4 w-full text-white'>
					<p className='capitalize font-bold mt-4 mb-2 text-amber-900 '>{user.attributes.preferred_username}</p>
					<FontAwesomeIcon icon={fas.faShirt} className='text-lg text-green-400'></FontAwesomeIcon>
                    {seasonTops.length}
                    <Image src={'/assets/icons/pants_icon.webp'} alt='icon_pants' width={30} height={30} className='fill-green-300 dark:fill-green-400'></Image>
                    {seasonBottoms.length}
					<p>
                        <FontAwesomeIcon icon={fas.faFoucet} className='text-lg text-amber-900'></FontAwesomeIcon>
                        {washPercent}
                    </p>

				</div>

                <button
                onClick={() => {}}>
                    <FontAwesomeIcon icon={fas.faCameraRetro} className='text-lg text-amber-900 pr-6'></FontAwesomeIcon>
                </button>
				<div className='hidden md:flex left-0 top-0 z-10 text-white'>

					<button onClick={async () => {
						await Auth.signOut()
						setUser(null)
						setAppContext(new AppInfo())
						router.push('/')

					}}><FontAwesomeIcon icon={fas.faRightFromBracket}></FontAwesomeIcon></button>
				</div>
				{/* Hamburger Icon */}
				<div
					onClick={handleNav}
					className='md:hidden'
				>
					<FontAwesomeIcon icon={fas.faBars} className='ml-10 text-sm' />
				</div>

			</div>
			<div
				className={
					nav
						? 'md:hidden fixed left-0 top-0 w-3/4 h-screen bg-green-400 z-10'
						: 'hidden'
				} >
				<ProfileCard />
			</div>
		</div>
	)
}

export default Navbar;
