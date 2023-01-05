import React, { useState, useRef, useCallback, useContext } from "react"
import axios from 'axios'
// import Image from "next/image"
import Webcam from "react-webcam"
// authentication
import roboflowAccess from '../certificates/roboflowKey.json'
// context
import AuthContext from "../contexts/authContext"
import AppContext from '../contexts/appContext'
// components
import Garmint from '../models/garmint'
import Loading from './loading'
import GarmintConfirmation from './GarmintConfirmation'
// fonts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

interface ImageInterface {
  src: string
  width: number
  height: number
}

interface Predictions {
  class: string
  confidence: number
  height: number
  width: number
  x: number
  y: number
}

export default function GarmintCam(props: any) {
  const { user } = useContext(AuthContext)
  const { appContext, setAppContext } = useContext(AppContext)
  // image and cam references for getting current video/images
  // const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  // states for controlling camera display
  const [webcamLoading, setWebcamLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [image, setImage] = useState<ImageInterface>({
    src: '',
    width: 0,
    height: 0
  })
  const [predictions, setPredictions] = useState<Array<Predictions>>([])


  const handleUserMedia = () => {
    setWebcamLoading(false)
  }

  const closeCam = () => {
    props.toggleCam()
    setWebcamLoading(true)
  }

  const capture = async () => {
    if (webcamRef && webcamRef.current != null) {
      setProcessing(true)
      // console.log(webcamRef.current.getScreenshot())
      const imageData = webcamRef.current.getScreenshot()
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
        if (res.data.predictions.length && imageData) {
          /* ######### Move Everything Into A Confirmation Component ############# */
          // set another state variable here to display it with everything we've found, maybe create initial Garmint to pass to Confirmation
          setImage({
            src: imageData,
            width: res.data.image.width,
            height: res.data.image.height
          })
          setPredictions(res.data.predictions)
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

          const params = {
            TableName: 'garmints',
            Item,
          }

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

  const styleGarmintCam: React.CSSProperties = {
    position: 'absolute',
    alignSelf: 'center',
    boxShadow: '0px 10px 100px 8px var(--mint-shaded)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--amplify-colors-white)',
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
    color: 'var(--mint)'
  }
  // possibly map the length of predictions and create one confirm for each, z-index = length - index so
  // first one is layed over 2nd, and so on, swap predictions from array to individual
  return (
    <>{predictions.length ?
      <GarmintConfirmation
        image={image}
        predictions={predictions}
        camState={{setPredictions, setProcessing, setWebcamLoading}}
        index={0}
      />
    : <div style={styleGarmintCam}>
        <div style={{position: 'relative'}}>
          <FontAwesomeIcon icon={faWindowClose} style={styleCloseButton} onClick={closeCam}/>
          {webcamLoading && <Loading width={350} height={350} />}
          {processing && <Loading width={webcamRef.current!.canvas.width} height={webcamRef.current!.canvas.height} />}
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
      </div>}
    </>
  );
};
