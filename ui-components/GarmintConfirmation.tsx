import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import GarmintCheckbox from "./GarmintCheckbox"
import TemperatureRange from './TemperatureRange'

interface ImageInterface {
  src: string
  width: number
  height: number
}

interface Prediction {
  class: string
  confidence: number
  height: number
  width: number
  x: number
  y: number
}

interface CamState {
  setPredictions: Function,
  setProcessing: Function,
  setWebcamLoading: Function,
}

export default function garmintConfirmation(
  { image,
    predictions,
    camState,
    index,
  }:{
    image: ImageInterface,
    predictions: Array<Prediction>,
    camState: CamState,
    index: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingCanvas, setLoadingCanvas] = useState(true)
  const [refresh, setRefresh] = useState(false)
  // types
  const checkTop = useRef<HTMLInputElement>(null)
  const checkBottom = useRef<HTMLInputElement>(null)
  const checkOuter = useRef<HTMLInputElement>(null)
  // colors
  const checkBlack = useRef<HTMLInputElement>(null)
  const checkBlue = useRef<HTMLInputElement>(null)
  const checkBrown = useRef<HTMLInputElement>(null)
  const checkGreen = useRef<HTMLInputElement>(null)
  const checkOrange = useRef<HTMLInputElement>(null)
  const checkPurple = useRef<HTMLInputElement>(null)
  const checkRed = useRef<HTMLInputElement>(null)
  const checkYellow = useRef<HTMLInputElement>(null)
  const checkWhite = useRef<HTMLInputElement>(null)
  // temp
  const [low, setLow] = useState(32)
  const [high, setHigh] = useState(100)

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      // create new image to draw in canvas
      const canvasImage = new Image()
      canvasImage.src = image.src
      // get context of canvas to enable drawing, and fill with canvasImage
      const ctx = canvasRef.current.getContext('2d')!
      ctx.drawImage(canvasImage, 0, 0)
      // use mint-primary color for stroke
      ctx.lineWidth = 6
      ctx.strokeStyle = 'hsl(158.1, 48.8%, 50%)'
      // predictions x, y values are of the center of the garmint
      ctx.strokeRect(
        predictions[index].x - (predictions[index].width / 2),
        predictions[index].y - (predictions[index].height / 2),
        predictions[index].width,
        predictions[index].height
      )
      // maybe switch case for colors
      if (checkTop.current && predictions[index].class == "0") checkTop.current.checked = true
      if (checkBottom.current && predictions[index].class == "1") checkBottom.current.checked = true
      if (checkOuter.current && predictions[index].class == "2") checkOuter.current.checked = true
      // update state to rerender the canvas
      setLoadingCanvas(false)
    }
  })

  const confirmGarmint = () => {
    console.log('tops', checkTop.current?.checked)
    console.log('bottoms', checkBottom.current?.checked)
    console.log('outer', checkOuter.current?.checked)
  }

  const discardGarmint = () => {
    predictions.splice(index, 1)
    camState.setPredictions(predictions)
    if (!predictions.length) {
      camState.setProcessing(false)
      camState.setWebcamLoading(true)
    }
  }

  const styleConfirmation: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0px 10px 100px 8px var(--mint-shaded)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--amplify-colors-white)',
    width: image.width + 30,
    fontWeight: 'bold',
  }

  const styleDivider: React.CSSProperties = {
    width: image.width,
    borderColor: 'var(--burntOrange)',
    borderTopWidth: '3px',
    marginBottom: '7.5px',
  }

  const styleCloseButton: React.CSSProperties = {
    position: 'absolute',
    right: 7.5,
    top: 4.75,
    zIndex: 1,
    color: 'var(--mint)'
  }
  // probably needs grid layout to limit shitfing of columns in rows
  return (
    <div style={styleConfirmation} className='confirmation'>
      <FontAwesomeIcon
        icon={faWindowClose}
        style={styleCloseButton}
        onClick={discardGarmint}
      />
      <p>Garmint Detected!</p>
      <div style={{width: image.width, height: image.height}}>
        <canvas
          ref={canvasRef}
          height={image.height}
          width={image.width}
          hidden={loadingCanvas}
        />
      </div>
      <p>This looks like a...</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-2' style={{width: image.width}} >
        <GarmintCheckbox ref={checkTop} label='Top' />
        <GarmintCheckbox ref={checkBottom} label='Bottom' />
        <GarmintCheckbox ref={checkOuter} label='Outer Wear' />
      </div>
      <p>It's colors are...</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkBlack} label='Black' />
        <GarmintCheckbox ref={checkBlue} label='Blue' />
        <GarmintCheckbox ref={checkBrown} label='Brown' />
      </div>
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkGreen} label='Green' />
        <GarmintCheckbox ref={checkOrange} label='Orange' />
        <GarmintCheckbox ref={checkPurple} label='Purple' />
      </div>
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkRed} label='Red' />
        <GarmintCheckbox ref={checkYellow} label='Yellow' />
        <GarmintCheckbox ref={checkWhite} label='White' />
      </div>
      <p>What temperatures can you wear it in?</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <TemperatureRange
          low={low}
          setLow={setLow}
          high={high}
          setHigh={setHigh}
          min={32}
          max={100}
          width={image.width}
        />
      </div>
      <p>What style would you wear it with?</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >

      </div>
      <hr style={styleDivider} />
      <div className='flex justify-around items-center w-full'>
        <button onClick={discardGarmint} className='button mb-2' >Discard</button>
        <button onClick={confirmGarmint}  className='button mb-2' >Confirm</button>
      </div>
    </div>
  )
}
