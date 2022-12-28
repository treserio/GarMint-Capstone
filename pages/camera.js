// import { write } from "fs";
import React, { useRef, useEffect, useState } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(false);

  const getMedia = () => {
    const constraints = {
      video: { facingMode: "environment" },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        setMediaStream(stream);
      })
      .catch((e) => console.log(e));
  };

  const capture = () => {
    const canvas = document.getElementsByClassName('canvas')
    console.log(canvas);

    const width = 414;
    const height = 736;

    let video = videoRef;
    let photo = photoRef;

    photo.width = width;
    photo.height = height;

    canvas.getContext("2d").drawImage(video, 0, 0, width, height);
    console.log(context);
    let data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
    console.log(data);
    setMediaStream(true);
  };


  useEffect(() => {
    getMedia();
  }, [videoRef]);


  const clear = () => {
    photoRef.current.src = "";
  };

  // save photo to database not sure what tags need be used to save to database

  // const savePhoto = () => {
  //   const photo = photoRef.current.src;
  //   const data = { photo };
  //   fetch('/api/savePhoto', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })
  // }

  // save image to a file locally
  // const savePhoto = () => {
  //  const photo = photoRef.current.src;
  //  write(photo, 'image.png', function(err) {
  //    if (err) {
  //      console.log(err);
  //    } else {
  //      console.log('Photo saved successfully!');
  //    }
  //  }, 'base64');
  // }
  return (
    <div className='camera'>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%" }}
      />
      <div className={"result " + (mediaStream ? 'mediaStream' : '')} />
        <canvas ref={photoRef}></canvas>
      <div className="flex items-center justify-around camera-controls">
        <button className="button button:hover" onClick={capture}>Capture</button>
        <button className='button button:hover' onClick={clear}>Clear</button>
      </div>
    </div>
  );
}
