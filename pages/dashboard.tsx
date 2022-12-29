import React, { useState } from "react";
import CamApp from "../components/camApp";

function Dashboard() {
const [isCameraOpen, setIsCameraOpen] = useState(false);

const toggleCam = () => setIsCameraOpen(!isCameraOpen);


return (
    <div className="flex flex-col items-center justify-center ">
        <h2 className="text-center font-semibold">Now lets get your closet set up for the AI</h2>
        <button  className="button button:hover button:focus mt-2"

            onClick={() => toggleCam() }>Scan Items</button>

    </div>
 )
}

export default Dashboard;
