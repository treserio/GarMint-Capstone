import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

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
  // const topClass = 'rounded-full button'

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
      if (predictions[index].class == "0") checkTop.current!.checked = true
      // update state to rerender the canvas
      setLoadingCanvas(false)
    }
    console.log('tops', checkTop.current)
    console.log('bottoms', checkBottom.current?.checked)
    console.log('outer', checkOuter.current?.checked)
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
        <input
          type='checkbox'
          id='top'
          value='top'
          ref={checkTop}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='top'
            className='rounded-full px-3 py-1'
          >
            Top
          </label>
        </div>
        <input
          type='checkbox'
          id='bottom'
          value='bottom'
          ref={checkBottom}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='bottom'
            className='rounded-full px-3 py-1'
          >
            Bottom
          </label>
        </div>
        <input
          type='checkbox'
          id='Outer'
          value='Outer'
          ref={checkOuter}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='Outer'
            className='rounded-full px-3 py-1'
          >
            Outer Wear
          </label>
        </div>
      </div>
      <p>It's colors are...</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <input
          type='checkbox'
          id='black'
          value='black'
          ref={checkBlack}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='black'
            className='rounded-full px-3 py-1'
          >
            Black
          </label>
        </div>
        <input
          type='checkbox'
          id='blue'
          value='blue'
          ref={checkBlue}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='blue'
            className='rounded-full px-3 py-1'
          >
            Blue
          </label>
        </div>
        <input
          type='checkbox'
          id='brown'
          value='brown'
          ref={checkBrown}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='brown'
            className='rounded-full px-3 py-1'
          >
            Brown
          </label>
        </div>
      </div>
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <input
            type='checkbox'
            id='green'
            value='green'
            ref={checkGreen}
            hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='green'
            className='rounded-full px-3 py-1'
          >
            Green
          </label>
        </div>
        <input
          type='checkbox'
          id='orange'
          value='orange'
          ref={checkOrange}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='orange'
            className='rounded-full px-3 py-1'
          >
            Orange
          </label>
        </div>
        <input
          type='checkbox'
          id='purple'
          value='purple'
          ref={checkPurple}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='purple'
            className='rounded-full px-3 py-1'
          >
            Purple
          </label>
        </div>
      </div>
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <input
          type='checkbox'
          id='red'
          value='red'
          ref={checkRed}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='red'
            className='rounded-full px-3 py-1'
          >
            Red
          </label>
        </div>
        <input
          type='checkbox'
          id='yellow'
          value='yellow'
          ref={checkYellow}
          hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='yellow'
            className='rounded-full px-3 py-1'
          >
            Yellow
          </label>
        </div>
        <input
            type='checkbox'
            id='white'
            value='white'
            ref={checkWhite}
            hidden={true}
        />
        <div>
          <FontAwesomeIcon icon={faCircleCheck} className='fadeInCheck -ml-4' />
          <label
            htmlFor='white'
            className='rounded-full px-3 py-1'
          >
            White
          </label>
        </div>
      </div>
      <p>What temperatures can you wear it in?</p>
      <hr style={styleDivider} />
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >

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
