
import GarmintSlider from "../ui-components/GarmintSlider"
import FilterDrawer from "../ui-components/filterDrawer"
import React, { useState, useRef, useContext, useEffect } from "react"
import AppContext from '../contexts/appContext'
import GarMint from '../models/garmint'
// import AuthContext from '../contexts/authContext'

// interface Seasonal {
//   top: Array<GarMint>
//   bot: Array<GarMint>
// }

function Dashboard() {
  const { appContext } = useContext(AppContext)
  // const { user } = useContext(AuthContext)

  // const [seasonalTops, setSeasonalTops] = useState<Array<GarMint>>([])
  // const [seasonalBottoms, setSeasonalBottoms] = useState<Array<GarMint>>([])

  // let seasonalTops: Array<GarMint>  = []
  // let seasonalBottoms: Array<GarMint>  = []
  const seasonalTops: Array<GarMint> = appContext.tops.filter(item => {
    let check = false
    if (item.uses > item.worn) {
      for (let season of appContext.seasons) {
        check = item.styles.includes(season)
        if (check) break
      }
    }
    return check
  })
  const seasonalBottoms: Array<GarMint> = appContext.bottoms.filter(item => {
    let check = false
    if (item.uses > item.worn) {
      for (let season of appContext.seasons) {
        check = item.styles.includes(season)
        if (check) break
      }
    }
    return check
  })

  const top_track = useRef<HTMLDivElement>(null)
  const bot_track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('wtf', appContext.garmintCount)
    if (appContext.garmintCount) {
      console.log('update arrays??!?!?')
      // setSeasonalTops(appContext.tops.filter(item => {
      //   let check = false
      //   if (item.uses > item.worn) {
      //     for (let season of appContext.seasons) {
      //       check = item.styles.includes(season)
      //       if (check) break
      //     }
      //   }
      //   return check
      // }))
      // setSeasonalBottoms(appContext.bottoms.filter(item => {
      //   let check = false
      //   if (item.uses > item.worn) {
      //     for (let season of appContext.seasons) {
      //       check = item.styles.includes(season)
      //       if (check) break
      //     }
      //   }
      //   return check
      // }))
      // seasonalTops = appContext.tops.filter(item => {
      //   let check = false
      //   if (item.uses > item.worn) {
      //     for (let season of appContext.seasons) {
      //       check = item.styles.includes(season)
      //       if (check) break
      //     }
      //   }
      //   return check
      // })
      // seasonalBottoms = appContext.bottoms.filter(item => {
      //   let check = false
      //   if (item.uses > item.worn) {
      //     for (let season of appContext.seasons) {
      //       check = item.styles.includes(season)
      //       if (check) break
      //     }
      //   }
      //   return check
      // })
    }
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    // console.log(e)
    if (e.clientY > 108 && e.clientY < 458) {
      if (top_track.current) {
        top_track.current.dataset.mouseDownAt = e.clientX + ''
      }
    } else if (e.clientY > 458 && e.clientY < 808 ) {
      if (bot_track.current) {
        bot_track.current.dataset.mouseDownAt = e.clientX + ''
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    // console.log('moving', e)
    // console.log(top_track.current?.dataset.mouseDownAt, bot_track.current?.dataset.mouseDownAt)
    // console.log('top data', top_track.current?.dataset)
    // console.log('bot data', bot_track.current?.dataset)
    if (top_track.current && top_track.current.dataset.mouseDownAt && top_track.current.dataset.mouseDownAt !== '0') {
      const mouseDelta = parseFloat(top_track.current.dataset.mouseDownAt) - e.clientX
      // div 2 to reduce scroll to 1/2, not sure we want it that fast, may depend on number of items
      const maxDelta = window.innerWidth / 1.5

      const percentage = (mouseDelta / maxDelta) * -100
      let nextPercentage = parseFloat(top_track.current.dataset.prevPercentage!) + percentage
      // restrict nextPercentage to lowest or highest values
      nextPercentage = Math.min(nextPercentage, -5)
      nextPercentage = Math.max(nextPercentage, -95)

      top_track.current.dataset.percentage = nextPercentage + ''
      top_track.current.style.transform = `translate(${nextPercentage}%, -50%)`
      top_track.current.style.setProperty('--trackImgTop', `${Math.round(nextPercentage + 100)}%`)
      // setting styles on all the images, if they're all keyed off the same one can use above
      // ultimately I'd prefer that the images scroll as they cross the page...
      // for (const child of Object.values(top_track.current.children as HTMLCollectionOf<HTMLElement>)) {
      //   const reform = child.children as HTMLCollectionOf<HTMLImageElement>
      //   const grandChild = reform[0]
      //   // i wonder if I can just set the global variable, although local variables would look better
      //   // as they come into the view, but we don't have a predefined number here so...maybe too much
      //   grandChild.style.setProperty('--trackImgX', `${Math.round(nextPercentage + 100)}%`)
      // }
    }
    if (bot_track.current && bot_track.current.dataset.mouseDownAt && bot_track.current.dataset.mouseDownAt !== '0') {
      const mouseDelta = parseFloat(bot_track.current.dataset.mouseDownAt) - e.clientX
      // div 2 to reduce scroll to 1/2, not sure we want it that fast, may depend on number of items
      const maxDelta = window.innerWidth / 1.5

      const percentage = (mouseDelta / maxDelta) * -100
      let nextPercentage = parseFloat(bot_track.current.dataset.prevPercentage!) + percentage
      // restrict nextPercentage to lowest or highest values
      nextPercentage = Math.min(nextPercentage, -5)
      nextPercentage = Math.max(nextPercentage, -95)

      bot_track.current.dataset.percentage = nextPercentage + ''
      bot_track.current.style.transform = `translate(${nextPercentage}%, -50%)`
      bot_track.current.style.setProperty('--trackImgBot', `${Math.round(nextPercentage + 100)}%`)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (top_track.current && top_track.current.dataset.mouseDownAt !== '0') {
      top_track.current.dataset.mouseDownAt = '0'
      top_track.current.dataset.prevPercentage = top_track.current.dataset.percentage
    }
    if (bot_track.current && bot_track.current.dataset.mouseDownAt !== '0') {
      bot_track.current.dataset.mouseDownAt = '0'
      bot_track.current.dataset.prevPercentage = bot_track.current.dataset.percentage
    }
  }

  console.log('st', seasonalTops, '\nsb', seasonalBottoms)
  return (
    <div className="flex flex-col items-center justify-center ">
      <div
        id='top'
        className="slide-controller w-screen bg-gray-600 relative overflow-hidden"
        onMouseDown={e => handleMouseDown(e)}
        onMouseMove={e => handleMouseMove(e)}
        onMouseUp={e => handleMouseUp(e)}
      >
        <GarmintSlider
          id={'top_track'}
          ref={top_track}
          items={seasonalTops}
        />
      </div>
      <div
        id='bot'
        className="slide-controller w-screen bg-gray-600 relative overflow-hidden"
        onMouseDown={e => handleMouseDown(e)}
        onMouseMove={e => handleMouseMove(e)}
        onMouseUp={e => handleMouseUp(e)}
      >
        <GarmintSlider
          ref={bot_track}
          id={'bot_track'}
          items={seasonalBottoms}
        />
      </div>
      <FilterDrawer />
    </div>
  )
}

export default Dashboard;
