import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faCalendarDays, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import ProfileCard from './ProfileCard';
import { Auth } from '@aws-amplify/auth'
import AppContext, { AppInfo } from '../contexts/appContext'
import { useRouter } from 'next/router';
import AuthContext from "../contexts/authContext"
import GarMint from '../models/garmint'

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

		<div className="w-full h-32 shadow-xl shadow-green-400 " id="Navbar">
			<div className="flex justify-between  items-center w-full h-full px-3 2xl:px-16" >
				<div className=''>
					<Image src={'/assets/profile_HST.jpg'} alt="Tofer" width={40} height={40} className='rounded-full' />
					<p>{user.attributes.preferred_username}</p>

				</div>
				<div>
					Tops Count {seasonTops.length}
					Bottoms Count {seasonBottoms.length}

					<p>Wash Percent {washPercent}</p>

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
