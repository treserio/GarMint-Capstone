import React, { useState, useRef, useCallback, useContext } from "react"
import Webcam from "react-webcam"
import Image from "next/image"
import AuthContext from "../contexts/authContext"
import AppContext from '../contexts/appContext'
import Garmint from '../models/garmint'

const WebcamCapture = () => <Webcam />;

const videoConstraints = {
  width: 414,
  height: 736,
};


function CamApp() {
  const { user } = useContext(AuthContext)
  const { appContext, setAppContext } = useContext(AppContext)

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    if (webcamRef && webcamRef.current) {
      const imageData = webcamRef.current.getScreenshot()
      setImageSrc(imageData)
      console.log(imageData)
      console.log('capture Username', user.username)
      console.log('capture Count', appContext.garmintCount)
      const Item = Garmint.fromJson({
        owner_id: user.username,
        item_number: appContext.garmintCount + 1,
        colors: 'get from ai, and prompt user',
        styles: 'get from ai, and prompt user',
        temperature: 0,
        type: 'top',
        image: imageData,
        uses: Number(user.attributes['custom:use_limit']),
        worn: 0,
      })
      const params = {
        TableName: 'garmints',
        Item,
      }
      appContext.db.put(params, (err: any, data: any) => {
        console.log('tried to add shit')
        if (err) throw err
        setAppContext({
          ...appContext,
          garmintCount: appContext.garmintCount++,
          tops: Item.type == 'top' ? appContext.tops.push(Item) : appContext.tops,
          bottoms: Item.type == 'bottom' ? appContext.bottoms.push(Item) : appContext.bottoms,
        })
        console.log('after add', appContext)
      })
    }
  }

  const savePhoto = () => {

    console.log(imageSrc);
  }

  return (
    <>
      <Webcam
        audio={false}
        height={414}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={736}
        videoConstraints={videoConstraints}
      />
      <button className="button button:hover" onClick={capture}>Capture photo</button>
      {imageSrc && (
        <Image
          alt="Photo"
          src={imageSrc}
          width={414}
          height={736}
        />
      )}
      {imageSrc != '' ? <button className="button button:hover" onClick={savePhoto}>Save Photo</button> : null}
    </>
  );
};

export default CamApp;
