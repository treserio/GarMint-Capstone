import { useRouter } from 'next/router';
import AuthContext from '../contexts/authContext'
// import CamApp from '../components/camApp.js';
import { Auth } from '@aws-amplify/auth';
import { useState, useContext, SetStateAction, useRef } from 'react';
import Image from 'next/image';



export default function FirstTimeLoginInput() {

    const [preferred_username, setPreferredName] = useState('');
    const [wash_cycle, setWashCycle] = useState('7');
    const [use_limit, setUseLimit] = useState('1');
    const [picture, setPicture] = useState('');
    // const [wash_notification, setWashNotification] = useState('');

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const toggleCam = () => setIsCameraOpen(!isCameraOpen);
    let [missingName, setMissingName] = useState(false);
    let [missingPicture, setMissingPicture] = useState(false);
    const pigRef = useRef(null);
    const dogRef = useRef(null);
    const elephantRef = useRef(null);
    const deerRef = useRef(null);
    const foxRef = useRef(null);

    const { user } = useContext(AuthContext);

    const router = useRouter();

    const handleSubmit = (e: any) => {
        console.log(e);
        console.log(preferred_username);
        console.log(wash_cycle);
        console.log(use_limit);
        console.log(picture);

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
                    'picture': picture,
                    // 'custom:wash_notification': wash_notification
                })
                router.push('/dashboard');
            } catch (err) {
                console.log('updated user attributes', err);
                alert('Error updating user');
            }
        }

    }

    const handleHandleAvatar = (e: any) => {
        console.log(e);
        console.log(pigRef);
        pigRef.current!.className = pigRef.current!.className.replace('border-[var(--mint)]', '') ;
        dogRef.current!.className = dogRef.current!.className.replace('border-[var(--mint)]', '');
        elephantRef.current!.className = elephantRef.current!.className.replace('border-[var(--mint)]', '');
        deerRef.current!.className = deerRef.current!.className.replace('border-[var(--mint)]', '');
        foxRef.current!.className = foxRef.current!.className.replace('border-[var(--mint)]', '');

        switch (e.target) {
          case pigRef.current:
            pigRef.current!.classList.add('border-[var(--mint)]');
            setPicture('/assets/avatars/pig.png');
            break;
          case dogRef.current:
            dogRef.current!.classList.add('border-[var(--mint)]');
            setPicture('/assets/avatars/dog.png');
            break;
          case elephantRef.current:
            elephantRef.current!.classList.add('border-[var(--mint)]');
            setPicture('/assets/avatars/elephant.png');
            break;
          case deerRef.current:
            deerRef.current!.classList.add('border-[var(--mint)]');
            setPicture('/assets/avatars/deer.png');
            break;
          case foxRef.current:
            foxRef.current!.classList.add('border-[var(--mint)]');
            setPicture('/assets/avatars/fox.png');
            break;
          default:
            console.log('no match');
        }

    }


    return (
        <>
            <div className='
              grid
              text-white
              absolute
              top-1/2
              left-1/2
              transform -translate-x-1/2 -translate-y-1/2
              h-3/4
              place-items-center
              shadow-2xl shadow-[var(--mint)]
              dark:bg-slate-700
              rounded-lg'

              >
                <p className="text-2xl text-center px-3">Welcome to <b className='text-[var(--mint)] font-bold'>GarMint</b> your A.I. powered Fashion Valet!</p>
                <div>
                    <p className="text-xl text-center px-3">Please fill out the following information to get started</p>
                </div>
                <div>
                    <p className='text-xl text-center pb-2'>Let`s start with an avatar for your profile</p>
                    <div className='flex flex-row-2 justify-center gap-5'>
                        <Image
                            src='/assets/avatars/pig.png'
                            ref={pigRef}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full cursor-pointer border-4"
                            onClick={(e) => handleHandleAvatar(e)}
                        />
                        <Image
                            src='/assets/avatars/dog.png'
                            ref={dogRef}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full cursor-pointer border-4"
                            onClick={(e) => handleHandleAvatar(e)}
                        />
                        <Image
                            src='/assets/avatars/elephant.png'
                            ref={elephantRef}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full cursor-pointer border-4"
                            onClick={(e) => handleHandleAvatar(e)}
                        />
                        <Image
                            src='/assets/avatars/deer.png'
                            ref={deerRef}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full cursor-pointer border-4"
                            onClick={(e) => handleHandleAvatar(e)}
                        />
                        <input type="checkbox" name="" id="pickAvatar" hidden />
                        <Image
                            src='/assets/avatars/fox.png'
                            ref={foxRef}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full cursor-pointer border-4"
                            onClick={(e) => handleHandleAvatar(e)}
                        />
                    </div>
                </div>
                <form className="flex flex-col items-center justify-center ">
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-l font-semibold">Add your User Name for your Profile</label>
                        <input
                            type="text"
                            className="
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
                                bg-[var(--mint-primary)]
                                border-2
                                rounded-md
                                placeholder-gray-100"
                            onChange={(e) => setWashCycle(e.target.value)}
                            placeholder=" Default: 7 days"
                            required
                        />
                        <label className="text-l font-semibold ">How many times do you ware an item before washing?</label>
                        <input
                            type="number"
                            className="
                            bg-[var(--mint-primary)]
                            border-2
                            max='9'
                            min='1'
                            defaultValue={1}
                            required
                            rounded-md
                            placeholder-gray-100"
                            min={1}
                            max={9}
                            onChange={(e) => setUseLimit(e.target.value)}
                            placeholder=" Default: 1 use"

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
                    <button className="button button:hover button:focus mt-2 shadow-md shadow-slate-200" onClick={handleSubmit}>Submit</button>
                </form>

            </div>
        </>
    );

}
