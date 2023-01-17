import React, { useState, useEffect, useContext, useRef } from 'react'
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

const Navbar = () => {
	const { user, setUser } = useContext(AuthContext)
	const { appContext, setAppContext } = useContext(AppContext)

	const [nav, setNav] = useState(false);

  const [seasonTops, setSeasonTops] = useState<Array<GarMint>>([])
  const [seasonBottoms, setSeasonBottoms] = useState<Array<GarMint>>([])
  const [washPercent, setWashPercent] = useState(0)

  const washingMachine = useRef(null)

  // for activating the camera
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const toggleCam = () => setIsCameraOpen(!isCameraOpen)

	const router = useRouter()

	useEffect(() => {
    if (appContext.garmintCount && washingMachine.current) {
      const season = "fall"

      setSeasonTops(appContext.tops.filter(item =>
        item.styles.includes(season) && item.uses > item.worn
      ))
      setSeasonBottoms(appContext.bottoms.filter(item =>
        item.styles.includes(season) && item.uses > item.worn
      ))
      const dirtyTops = appContext.tops.filter(item =>
        item.uses === item.worn
      )
      const dirtyBottoms = appContext.bottoms.filter(item =>
        item.uses === item.worn
      )
      if (seasonTops.length || seasonBottoms.length) {
        setWashPercent(Math.round(
          (dirtyTops.length + dirtyBottoms.length) /
          (appContext.tops.length + appContext.bottoms.length) * 100
        ))
      }
      console.log('st', seasonTops)
      console.log('sb', seasonBottoms)
      console.log('dirty t', dirtyTops)
      console.log('dirty t', dirtyBottoms)
    }
  }, [washingMachine])

	const handleNav = () => {
		setNav(!nav);
	}

	return (<>
		<div className="w-full flex bg-slate-800 justify-around items-center" id="Navbar">
      <div className='flex my-3 w-1/3 justify-around'>
        <div className='mx-4'>
          <Image
            src={'/assets/avatars/avatar1.png'}
            alt="Tofer"
            width={80}
            height={80}
            className='rounded-full'
          />
        </div>
        <div className='flex flex-col'>
          <div className='
            capitalize
            font-bold
            mb-2
            text-[var(--burntOrange)]
            text-3xl
            justify-center
          '>
            {user.attributes.preferred_username}
          </div>
          <div className='flex justify-around items-center gap-3 text-3xl text-[var(--mint)]' >
            <div className='flex gap-1 items-center'>
              {seasonTops.length}
              <FontAwesomeIcon icon={fas.faShirt} />
            </div>
            <div className='flex gap-1 items-center'>
              {seasonBottoms.length}
              <Image
                src='/assets/icons/pants.png'
                alt='Best Pants Ever'
                width={22}
                height={500}
              />
            </div>
            <div className='flex items-center'>
              {washPercent}
              <Image
                src='/assets/icons/washing-machine-icon.webp'
                alt='washing machine'
                width={40}
                height={40}
                ref={washingMachine}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={toggleCam}
      >
        <FontAwesomeIcon icon={fas.faCameraRetro} className='text-6xl text-[var(--mint)]' />
      </button>
      {/* weather here */}
      <div>
        {appContext.weather?.low}
        {appContext.weather?.avg}
        {appContext.weather?.high}
      </div>
      <button
        onClick={async () => {
          await Auth.signOut()
          setUser(null)
          setAppContext(new AppInfo())
          router.push('/')
        }}
      >
        <FontAwesomeIcon icon={fas.faRightFromBracket} className='text-6xl text-[var(--mint)]' />
      </button>
				{/* Hamburger Icon
				<div
					onClick={handleNav}
					className='md:hidden'
				>
					<FontAwesomeIcon icon={fas.faBars} className='ml-10 text-sm' />
				</div> */}
    </div>
    {isCameraOpen && <GarmintCam toggleCam={toggleCam} />}
  </>)
}

export default Navbar;





// 				{/* Hamburger Icon */}
// 				<div
// 					onClick={handleNav}
// 					className='md:hidden'
// 				>
// 					<FontAwesomeIcon icon={fas.faBars} className='ml-10 text-sm' />
// 				</div>

// 			</div>
// 			<div
// 				className={
// 					nav
// 						? 'md:hidden fixed left-0 top-0 w-3/4 h-screen bg-[var(--mint)] z-10'
// 						: 'hidden'
// 				} >
// 				<ProfileCard />
// 			</div>
// 		</div>
