<<<<<<< HEAD
import React, { useState } from "react"
import GarmintCam from "../ui-components/GarmintCam"
import { useRef } from 'react'
=======
import React, { useState } from "react";
import CamApp from "../components/camApp";
import GarmintSlider from "../ui-components/carousel";
>>>>>>> working on carousel

function Dashboard() {
  const [cameraOn, setIsCameraOpen] = useState(false);
  const toggleCam = () => setIsCameraOpen(!cameraOn);

  const stuff = useRef(null)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!cameraOn && <>
        <h2 className="text-center font-semibold">Now lets get your closet set up for the AI</h2>
        <button
          className="button button:hover mt-2"
          onClick={() => toggleCam()}
        >
          Scan Items
        </button>
      </>}
      {cameraOn && <GarmintCam toggleCam={toggleCam} />}
    </div>
  )
}

export default Dashboard;
