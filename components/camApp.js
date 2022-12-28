import React, { useState, useRef, useCallback} from "react";
import Webcam from "react-webcam";
import Image from "next/image";

const WebcamCapture = () => <Webcam />;
const videoConstraints = {
  width: 414,
  height: 736,
};



function CamApp()   {
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    console.log(imageSrc);
  }, [webcamRef, setImageSrc]);

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
        <Image alt="Photo"
          src={imageSrc} width={414} height={736} />
      )}
        {imageSrc != '' ? <button className="button button:hover" onClick={savePhoto}>Save Photo</button> : null}
    </>
  );
};

export default CamApp;
