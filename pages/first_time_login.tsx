// import  useUserMedia  from '../ui-components/access_cam.js';
// import Camera from './camera';
import CamApp from '../components/camApp.js';
import { useState } from 'react';

function FirstTimeLoginInput() {

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const toggleCam = () => setIsCameraOpen(!isCameraOpen);

    return (
        <>
        <div className='grid text-white h-screen place-items-center bg-lime-800 dark:bg-slate-700'>
        <p className="text-3xl font-bold text-center ">Welcome GarMint your AI powered outfit selector!</p>
            <form className="flex flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-center">
                    <label className="text-l font-semibold">Add your User Name for your Profile</label>
                    <input type="text" className="
                        bg-green-300
                        border-2
                        required
                        rounded-md"
                        placeholder="User Name" />

                    <label className="text-l font-semibold ">How many times do you ware an item before washing?</label>
                    <input  type="number" className="
                      bg-green-300
                        border-2
                        max='9'
                        min='1'
                        defaultValue={1}
                        required
                        rounded-md" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <label className="text-l font-semibold"> Would you like washing notification ?</label>
                    <input type="bool" className="
                        bg-green-300
                        border-2
                        defaultValue={Yes}
                        required
                        rounded-md"
                        placeholder="yes/no" />
                </div>
                <button className="button button:hover button:focus mt-2">Submit</button>
            </form>
            <div className="flex flex-col items-center justify-center ">
                <h2 className="text-center font-semibold">Now lets get your closet set up for the AI</h2>
                <button  className="button button:hover button:focus mt-2"

                onClick={() => toggleCam() }>Scan Items</button>

            </div>
            {isCameraOpen && <CamApp />}
        </div>
        </>
        );

    }

export default FirstTimeLoginInput;
