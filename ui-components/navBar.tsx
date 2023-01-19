import React, { useState, useEffect, useContext, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Auth } from '@aws-amplify/auth'
import AppContext, { AppInfo } from '../contexts/appContext'
import { useRouter } from 'next/router';
import AuthContext from "../contexts/authContext"
import GarMint from '../models/garmint';
import GarmintCam  from './GarmintCam';

const Navbar = () => {
	const { user, setUser } = useContext(AuthContext)
	const { appContext, setAppContext } = useContext(AppContext)

  const [seasonalTops, setSeasonalTops] = useState<Array<GarMint>>([])
  const [seasonalBottoms, setSeasonalBottoms] = useState<Array<GarMint>>([])
  const [washPercent, setWashPercent] = useState(0)
  // const [avgWeather, setAvgWeather] = useState<number | undefined>(0)
  const [refresh, setRefresh] = useState(false)

  // for activating the camera
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const toggleCam = () => setIsCameraOpen(!isCameraOpen)

	const router = useRouter()

	useEffect(() => {
    if (appContext.garmintCount) {
      const seasonalTops = appContext.tops.filter(item => {
        let check = false
        if (item.uses > item.worn) {
          for (let season of appContext.seasons) {
            check = item.styles.includes(season)
            if (check) break
          }
        }
        return check
      })
      const seasonalBottoms = appContext.bottoms.filter(item => {
        let check = false
        if (item.uses > item.worn) {
          for (let season of appContext.seasons) {
            check = item.styles.includes(season)
            if (check) break
          }
        }
        return check
      })
      const dirtyTops = appContext.tops.filter(item => {
        let check = false
        if (item.uses === item.worn) {
          for (let season of appContext.seasons) {
            check = item.styles.includes(season)
            if (check) break
          }
        }
        return check
      })
      const dirtyBottoms = appContext.bottoms.filter(item => {
        let check = false
        if (item.uses === item.worn) {
          for (let season of appContext.seasons) {
            check = item.styles.includes(season)
            if (check) break
          }
        }
        return check
      })
      if (seasonalTops.length || seasonalBottoms.length) {
        setSeasonalTops(seasonalTops)
        setSeasonalBottoms(seasonalBottoms)
        setWashPercent(Math.round(
          (dirtyTops.length + dirtyBottoms.length) /
          (seasonalTops.length + seasonalBottoms.length) * 100
        ))
      }
      console.log('NBar Weather', appContext.weather)
      setTimeout(() => setRefresh((prevRefresh) => !prevRefresh), 333)
    }

  }, [appContext.garmintCount, appContext.weather])

	return (<>
		<div
      className="
        w-full
        flex
        justify-between
        items-center
        px-5
      "
      id="Navbar"
    >
      <div className='flex my-1 items-center'>
        <div className='mr-4'>
          <Image
            src={user.attributes.picture ? user.attributes.picture : '/assets/mintLeaf.png'}
            alt="avatar"
            width={user.attributes.picture ? 80 : 55}
            height={80}
            className='rounded-full'
          />
        </div>
        <div className='flex flex-col'>
          <div className='
            capitalize
            font-bold
            mb-1
            text-[var(--burntOrange)]
            text-3xl
            justify-center
          '>
            {user.attributes.preferred_username}
          </div>
          <div className='flex justify-around items-center gap-3.5 text-3xl text-[var(--mint)]' >
            <div className='flex gap-1 items-center'>
              {seasonalTops.length}
              <FontAwesomeIcon icon={fas.faShirt} />
            </div>
            <div className='flex gap-1 items-center'>
              {seasonalBottoms.length}
              <Image
                src='/assets/icons/pants.png'
                alt='Best Pants Ever'
                width={22}
                height={40}
              />
            </div>
            <div className='flex items-center'>
              {washPercent}%
              <Image
                src='/assets/icons/washing-machine-icon.webp'
                alt='washing machine'
                width={40}
                height={40}
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
      {appContext.weather ?
      <div className='flex gap-1 items-center'>
        <div
          id='low'
          className='
            text-cyan-400
            text-2xl
            font-bold
          '
        >
          {appContext.weather.low}&#176;
        </div>
        <div
          id='avg'
          className='
            text-6xl
            text-[var(--mint)]
            text-center
            font-bold
            ml-1
            pb-1
          '
        >
          {appContext.weather.avg}&#176;
        </div>
        <div
          id='high'
          className='
            text-rose-500
            text-2xl
            font-bold
          '
        >
          {appContext.weather.high}&#176;
        </div>
      </div>
      : <button
          className='
            button
            leading-none
          '
          onClick={() => setRefresh((prevRefresh) => !prevRefresh)}
        >
          check<br />weather
        </button>
      }

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
    </div>
    {isCameraOpen && <GarmintCam toggleCam={toggleCam} />}
  </>)
}

export default Navbar;
