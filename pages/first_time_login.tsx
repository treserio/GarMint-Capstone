import { useRouter } from 'next/router';
import AuthContext from '../contexts/authContext'
import CamApp from '../components/camApp.js';
import { Auth } from '@aws-amplify/auth';
import { useState, useContext } from 'react';

function FirstTimeLoginInput() {

    const [preferred_username, setPreferredName] = useState('');
    const [wash_cycle, setWashCycle] = useState('7');
    const [use_limit, setUseLimit] = useState('1');
    // const [wash_notification, setWashNotification] = useState('');

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const toggleCam = () => setIsCameraOpen(!isCameraOpen);
    let [missingName, setMissingName] = useState(false);

    const { user } = useContext(AuthContext);

    const router = useRouter();

    const handleSubmit = (e: any) => {
        console.log(e);
        console.log(preferred_username);
        console.log(wash_cycle);
        console.log(use_limit);
        // console.log(wash_notification);
        e.preventDefault();
        if (preferred_username === '') {
            setMissingName(true);
            return console.log('missing name');
        } else {
        try {
            Auth.updateUserAttributes(user, {
                'preferred_username': preferred_username,
                'custom:wash_cycle': wash_cycle,
                'custom:use_limit': use_limit,
                // 'custom:wash_notification': wash_notification
            })
            router.push('/dashboard');
        } catch (err) {
            console.log('updated user attributes', err);
            alert('Error updating user');
            }
        }

    }

    return (
        <>
            <div className='grid text-white h-screen place-items-center bg-lime-800 dark:bg-slate-700'>
                <p className="text-3xl font-bold text-center ">Welcome GarMint your AI powered outfit selector!</p>
                <form className="flex flex-col items-center justify-center ">
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-l font-semibold">Add your User Name for your Profile</label>
                        <input
                            type="text"
                            className="
                                text-black
                                bg-[var(--mint-primary)]
                                border-2
                                rounded-md
                                placeholder-[var(--mint-faded)]"
                            onChange={(e) => setPreferredName(e.target.value)}
                            placeholder="User Name"
                            color='black'
                            required
                        />
                        {missingName && <p className="text-red-300 text-xs">Please enter a username</p>}
                        <label className="text-l font-semibold">How many days between laundry day</label>
                        <input
                            type="text"
                            className="
                                text-black
                                bg-[var(--mint-primary)]
                                border-2
                                rounded-md
                                placeholder-[var(--mint-faded)]"
                            onChange={(e) => setWashCycle(e.target.value)}
                            placeholder="Default: 7 days"
                            required
                        />
                        <label className="text-l font-semibold ">How many times do you ware an item before washing?</label>
                        <input
                            type="number"
                            className="
                            text-black
                            bg-[var(--mint-primary)]
                            border-2
                            max='9'
                            min='1'
                            defaultValue={1}
                            required
                            rounded-md
                            placeholder-[var(--mint-faded)]"
                            min={1}
                            max={9}
                            onChange={(e) => setUseLimit(e.target.value)}
                            placeholder="Default: 1 use"

                        />
                    </div>
                    {/* <div className="flex flex-col items-center justify-center">
                        <label className="text-l font-semibold"> Would you like washing notification ?</label>
                        <input
                            type="bool"
                            className="
                            bg-green-300
                                border-2
                                defaultValue={Yes}
                                required
                                rounded-md"
                            placeholder="yes/no"
                            onChange={(e) => setWashNotification(e.target.value)}
                            value={wash_notification}
                            color='black'
                        />
                    </div> */}
                    <button className="button button:hover button:focus mt-2" onClick={handleSubmit}>Submit</button>
                </form>

            </div>
        </>
    );

}

export default FirstTimeLoginInput;
