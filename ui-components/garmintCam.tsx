import React, { useState, useRef, useCallback, useContext } from "react"
import roboflowAccess from '../certificates/roboflowKey.json'
import Webcam from "react-webcam"
import Image from "next/image"
import AuthContext from "../contexts/authContext"
import AppContext from '../contexts/appContext'
import Garmint from '../models/garmint'
import axios from 'axios'
import Loading from './loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'


export default function GarmintCam(props: any) {
  const { user } = useContext(AuthContext)
  const { appContext, setAppContext } = useContext(AppContext)
  // image and cam references for getting current video/images
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  // states for controlling camera display
  const [webcamLoading, setWebcamLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleUserMedia = () => {
    setWebcamLoading(false)
  }

  const closeCam = () => {
    props.toggleCam()
    setWebcamLoading(true)
  }

  const capture = async () => {
    if (webcamRef && webcamRef.current) {
      setProcessing(true)
      // console.log(webcamRef)
      // console.log(webcamRef.current.getScreenshot())
      const imageData = webcamRef.current.getScreenshot()

      console.log('capture Username', user.username)
      console.log('capture Count', appContext.garmintCount)
      // no conversion necessary
      const res = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/garmint-kbl0z/1",
        params: {
          api_key: roboflowAccess.key
        },
        data: imageData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then((res) => {
        console.log('axios res', res)
        if (res.data.predictions.length) {
          /* ######### Move Everything Into A Confirmation Component ############# */
          // set another state variable here to display it with everything we've found, maybe create initial Garmint to pass to Confirmation

          // x, y values on predictions are center points for the height / width that was found.
          // take 1/2 of width from x coordinate to get starting x point for image, add width to find entire width of image
          // take 1/2 of height from y coordinate to get starting y point for image, add hieght to find entire height of image
          const Item = Garmint.fromJson({
            owner_id: user.username,
            item_number: appContext.garmintCount + 1,
            colors: 'get from ai, and prompt user',
            styles: 'prompt for user at confirmation',
            low_temp: 0,
            high_temp: 0,
            type: res.data.predictions[0].class,
            image: imageData,
            uses: Number(user.attributes['custom:use_limit']),
            worn: 0,
          })
          /* confirmation modal,
            confirm temps with slider bar
            prompt user for style choice = [
              active
              casual
              formal
              buisiness casual
              work
            ]
            ui temp slider for clothing temperature range, dased on device temp setting
          */
          setImageSrc(imageData)
          const params = {
            TableName: 'garmints',
            Item,
          }

          console.log(params)
          // appContext.db.put(params, (err: any, data: any) => {
          //   console.log('db Add:', appContext)
          //   if (err) throw err
          //   // maybe initialize new class and assign values
          //   appContext.garmintCount++
          //   Item.type == 'top' && appContext.tops.push(Item)
          //   Item.type == 'bottom' && appContext.bottoms.push(Item)
          //   console.log('after add', appContext)
          //   setAppContext(appContext)
          // })
        } else {
          setProcessing(false)
          setImgError(true)
          console.log("A prediction wasn't able to be made from the image, please try again.")
        }

      })
      .catch((err) => {
        console.log(err)
        setProcessing(false)
        setImgError(true)
        // may need to better message here?
        // send message to user indicating issue with AI,
        // possibly create an error component that overlays the view, but not alert
      })
    }
  }

  const styleCamApp: React.CSSProperties = {
    position: 'absolute',
    alignSelf: 'center',
    // padding: '10px',
    // top: '2vh',
    // left: '2vw',
    boxShadow: '0px 10px 100px 8px var(--mint-shaded)',
    borderRadius: '0.5rem',
    // border: 'solid 1px var(--mint-primary)',
  }

  const styleSendButton: React.CSSProperties = {
    width: '100%',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
  }

  const styleCloseButton: React.CSSProperties = {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    color: 'var(--mint-primary)'
  }

  // {imageSrc && (
  //   <Image
  //     alt="Photo"
  //     src={imageSrc}
  //     width={350}
  //     height={350}
  //   />
  // )}

  return (
    <div style={styleCamApp}>
      <div style={{position: 'relative'}}>
        <FontAwesomeIcon icon={faWindowClose} style={styleCloseButton} onClick={closeCam}/>
        {(webcamLoading || processing) && <Loading />}
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 350,
            height: 350,
          }}
          onUserMedia={handleUserMedia}
          mirrored={true}
          hidden={webcamLoading || processing}
          style={{
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
          }}
        />
        <button
          className="newButton button:hover"
          style={styleSendButton}
          onClick={webcamLoading || processing ? () => {} : capture}
        >
          {webcamLoading ? 'Accessing Camera'
          : processing ? 'Processing Photo'
            : imgError ? 'Garmint Undetected, click to retry'
              : 'Send Garmint'}
        </button>
      </div>
    </div>
  );
};
