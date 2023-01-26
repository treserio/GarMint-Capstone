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
import Garmint from '../models/garmint';
import GarmintCam  from './GarmintCam';

interface batchMaker {
  TransactItems: Array<any>
}

const Navbar = () => {
	const { user, setUser } = useContext(AuthContext)
	const { appContext, setAppContext } = useContext(AppContext)

  const router = useRouter()

  const [refresh, setRefresh] = useState(false)
  const toggleRefresh = () => setRefresh((prevRefresh) => !prevRefresh)

  const [displaySeasonal, setDisplaySeasonal] = useState(true)
  const toggleDisplaySeasonal = () => setDisplaySeasonal((prevRefresh) => !prevRefresh)

  // for activating the camera
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const toggleCam = () => setIsCameraOpen((prevRefresh) => !prevRefresh)

  console.log(appContext)

  const allClean = appContext.garmints.filter(item =>
    item.uses > item.worn
  )
  const allDirty = appContext.garmints.filter(item =>
    item.uses <= item.worn
  )
  const allWashPercent = Math.round(
    allDirty.length / appContext.garmintCount * 100
  )

  const seasonalGarmints = appContext.garmints.filter(item => {
    let check = false
    for (let season of appContext.seasons) {
      check = item.styles.includes(season)
      if (check) break
    }
    return check
  })
  const seasonalDirty = seasonalGarmints.filter(item =>
    item.uses <= item.worn
  )
  const seasonalTops = seasonalGarmints.filter(item =>
    item.uses > item.worn && item.type == 'top'
  )
  const seasonalBottoms = seasonalGarmints.filter(item =>
    item.uses > item.worn && item.type == 'bottom'
  )
  const seasonalWashPercent = Math.round(
    seasonalDirty.length / seasonalGarmints.length * 100
  )

  async function checkWeather() {
    await appContext.getWeatherNWS()
    toggleRefresh()
  }

  async function washing(type: string) {
    // use same method used in dashboard for marking items as worn
    let batchParams: batchMaker = {
      TransactItems: []
    }
    let washArray: Array<Garmint> = []

    switch (type) {
      case 'all':
        washArray = allDirty
        break;
      case 'seasonal':
        washArray = seasonalDirty
        break;
      default:
        washArray = []
    }

    for (const item of washArray) {
      const transactItem = {
        Update: {
          TableName: 'garmints',
          Key: {
            owner_id: item.owner_id,
            item_number: item.item_number,
          },
          UpdateExpression: `set #a = :worn`,
          ExpressionAttributeNames: { '#a' : 'worn'},
          ExpressionAttributeValues: {
            ':worn': 0
          }
        }
      }
      batchParams.TransactItems.push(transactItem)
    }

    appContext.db.transactWrite(batchParams, (err, data) => {
      // retry if error, x times, then show user error
      if (err) console.log('transact write Error:', err)
      // update context with new values if db update succeeds
      for (const item of allDirty) {
        appContext.garmints[
          appContext.garmints.indexOf(item)
        ].worn = 0
      }
      const newContext = new AppInfo()
      setAppContext(Object.assign(newContext, appContext))
    })
  }

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
        <div
          className='
            flex
            flex-col
            cursor-pointer
          '
          onClick={toggleDisplaySeasonal}
        >
          <div
            className='
              flex
              justify-between
              items-center
              mb-1
              text-[var(--burntOrange)]
              font-bold
            '
          >
            <div
              className='
                flex
                justify-between
                capitalize
                text-3xl
              '
            >
              {user.attributes.preferred_username}
            </div>
            {displaySeasonal ? <small>seasonal</small> : <small>all</small>}
          </div>
          <div
            className='
              flex
              justify-around
              items-center
              gap-3.5
              text-3xl
              text-[var(--mint)]
            '
          >
            <div
              className='
                flex
                gap-1
                items-center
              '
            >
              {displaySeasonal ? seasonalTops.length
                : allClean.filter((item) => item.type === 'top').length
              }
              <FontAwesomeIcon icon={fas.faShirt} />
            </div>
            <div
              className='
                flex
                gap-1
                items-center
              '
            >
              {displaySeasonal ? seasonalBottoms.length
                : allClean.filter((item) => item.type === 'bottom').length
              }
              <Image
                src='/assets/icons/pants.png'
                alt='Best Pants Ever'
                width={22}
                height={40}
              />
            </div>
            <div className='flex items-center justify-end washPercentage'>
              {displaySeasonal ? seasonalWashPercent : allWashPercent}%
              <Image
                src='/assets/icons/laundryBasket2.png'
                alt='washing machine'
                width={30}
                height={40}
              />
            </div>
          </div>
        </div>
        <Image
          className='
            ml-2
            cursor-pointer
            img-button
          '
          src='/assets/icons/washingMachineHollow.webp'
          alt='washing machine'
          width={40}
          height={40}
          onClick={() => displaySeasonal ? washing('seasonal') : washing('all')}
        />
      </div>
      <button
        onClick={toggleCam}
      >
        <FontAwesomeIcon
          className='
            text-6xl
            text-[var(--mint)]
            hover:text-[var(--mint-shaded)]
          '
          icon={fas.faCameraRetro}
        />
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
          onClick={() => checkWeather()}
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
        <FontAwesomeIcon icon={fas.faRightFromBracket} className='text-6xl text-[var(--mint)] hover:text-[var(--mint-shaded)]' />
      </button>
    </div>
    {isCameraOpen && <GarmintCam toggleCam={toggleCam} />}
  </>)
}

export default Navbar;
