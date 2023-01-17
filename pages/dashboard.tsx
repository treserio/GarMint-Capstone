import GarmintCam from "../ui-components/GarmintCam"
import GarmintSlider from "../ui-components/carousel";
import React, { useState, useRef } from "react";


function Dashboard() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const toggleCam = () => setIsCameraOpen(!isCameraOpen);

  const card_track = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (card_track.current) {
      card_track.current.dataset.mouseDownAt = e.clientX + ''
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (card_track.current && card_track.current.dataset.mouseDownAt) {
      if (card_track.current.dataset.mouseDownAt === '0') return
      const mouseDelta = parseFloat(card_track.current.dataset.mouseDownAt) - e.clientX
      // div 2 to reduce scroll to 1/2, not sure we want it that fast, may depend on number of items
      const maxDelta = window.innerWidth / 1.5

      const percentage = (mouseDelta / maxDelta) * -100
      let nextPercentage = parseFloat(card_track.current.dataset.prevPercentage!) + percentage
      // restrict nextPercentage to lowest or highest values
      nextPercentage = Math.min(nextPercentage, -5)
      nextPercentage = Math.max(nextPercentage, -95)

      card_track.current.dataset.percentage = nextPercentage + ''
      card_track.current.style.transform = `translate(${nextPercentage}%, -50%)`
      card_track.current.style.setProperty('--trackImgX', `${Math.round(nextPercentage + 100)}%`)
      // setting styles on all the images, if they're all keyed off the same one can use above
      // ultimately I'd prefer that the images scroll as they cross the page...
      // for (const child of Object.values(card_track.current.children as HTMLCollectionOf<HTMLElement>)) {
      //   const reform = child.children as HTMLCollectionOf<HTMLImageElement>
      //   const grandChild = reform[0]
      //   // i wonder if I can just set the global variable, although local variables would look better
      //   // as they come into the view, but we don't have a predefined number here so...maybe too much
      //   grandChild.style.setProperty('--trackImgX', `${Math.round(nextPercentage + 100)}%`)
      // }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (card_track.current) {
      card_track.current.dataset.mouseDownAt = '0'
      card_track.current.dataset.prevPercentage = card_track.current.dataset.percentage
    }
  }


return (
  <div className="flex flex-col items-center justify-center ">
    <h2 className="text-center font-semibold">Now lets get your closet set up for the AI</h2>
    <button
      className="
        button
        mt-2
      "
      onClick={() => toggleCam() }
    >
      Scan Items
    </button>
    <div
      className="slide-controller w-screen bg-gray-600 relative overflow-hidden"
      onMouseDown={e => handleMouseDown(e)}
      onMouseMove={e => handleMouseMove(e)}
      onMouseUp={e => handleMouseUp(e)}
    >
      <GarmintSlider
        ref={card_track}
        // hmd={handleMouseDown}
        // hmm={handleMouseMove}
        // hmu={handleMouseUp}
      />
    </div>
    {isCameraOpen && <GarmintCam toggleCam={toggleCam} />}
  </div>
 )
}

export default Dashboard;
