import { useState, useRef, useEffect, useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import flowKeys from '../certificates/roboflowKey.json'
// ui components
import GarmintCheckbox from "./GarmintCheckbox"
import TemperatureRange from './TemperatureRange'
// context
import AuthContext from "../contexts/authContext"
import AppContext, { AppInfo } from '../contexts/appContext'
// model
import Garmint from '../models/garmint'

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
  setImgError: Function,
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
  const { user } = useContext(AuthContext)
  const { appContext, setAppContext } = useContext(AppContext)
  // for image conversion
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // workflow states
  const [classifyingGarmint, setclassifyingGarmint] = useState(true)
  const [refresh, setRefresh] = useState(false)
  // missing value checks
  const [missingType, setMissingType] = useState(false)
  const [missingColor, setMissingColor] = useState(false)
  const [missingStyle, setMissingStyle] = useState(false)

  // value from classification AI to preset type checkboxes
  const [garmintType, setGarmintType] = useState('')
  // temp
  const [low, setLow] = useState(32)
  const [high, setHigh] = useState(100)
  // types
  const checkTop = useRef<HTMLInputElement>(null)
  const checkBottom = useRef<HTMLInputElement>(null)
  const checkOuter = useRef<HTMLInputElement>(null)
  // colors
  const checkBlack = useRef<HTMLInputElement>(null)
  const checkBlue = useRef<HTMLInputElement>(null)
  const checkBrown = useRef<HTMLInputElement>(null)
  const checkGreen = useRef<HTMLInputElement>(null)
  const checkGrey = useRef<HTMLInputElement>(null)
  const checkOrange = useRef<HTMLInputElement>(null)
  const checkPurple = useRef<HTMLInputElement>(null)
  const checkRed = useRef<HTMLInputElement>(null)
  const checkYellow = useRef<HTMLInputElement>(null)
  const checkWhite = useRef<HTMLInputElement>(null)
  const checkMulti = useRef<HTMLInputElement>(null)
  // style
  const checkSpring = useRef<HTMLInputElement>(null)
  const checkSummer = useRef<HTMLInputElement>(null)
  const checkFall = useRef<HTMLInputElement>(null)
  const checkWinter = useRef<HTMLInputElement>(null)
  const checkActive = useRef<HTMLInputElement>(null)
  const checkCasual = useRef<HTMLInputElement>(null)
  const checkFormal = useRef<HTMLInputElement>(null)
  const checkWork = useRef<HTMLInputElement>(null)
  const checkBusinessCasual = useRef<HTMLInputElement>(null)
  // uses
  const inputUses = useRef<HTMLInputElement>(null)
  const [garmintUses, setGarmintUses] = useState(Number(user.attributes['custom:use_limit']))

  // stop multiple ai hits
  let stopper: boolean = true

  // classify values and draw final confirmation image
  useEffect(() => {
    if (!classifyingGarmint && canvasRef.current) {
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
      if (checkTop.current && checkBottom.current && checkOuter.current) {
        switch (garmintType.toLowerCase()) {
          case 'top':
            checkTop.current.checked = true
            break;
          case 'bottom':
            checkBottom.current.checked = true
            break;
          case 'outerwear':
            checkOuter.current.checked = true
            break;
        }
      }
    }
  }, [classifyingGarmint])

  useEffect(() => {
    checkSeason()
  }, [low, high, classifyingGarmint])

  // draw image cropped to bounding boxes
  useEffect(() => {
    if (classifyingGarmint) {
      if (canvasRef.current) {
        const imgCrop = new Image()
        imgCrop.src = image.src
        // console.log('img src', imgCrop.src)
        const ctx = canvasRef.current.getContext('2d')!
        ctx.drawImage(
          imgCrop,
          predictions[index].x - (predictions[index].width / 2),
          predictions[index].y - (predictions[index].height / 2),
          predictions[index].width,
          predictions[index].height,
          0,
          0,
          predictions[index].width,
          predictions[index].height
        )
      }
      if (stopper) {
        // keep this from firing off multiple times
        stopper = false
        setRefresh(true)
        const newGarmint = canvasRef.current?.toDataURL('image/jpeg')
        // console.log('cropped', newGarmint)

        // run rgb classification code here
        // send request to classification api here
        axios({
          method: "POST",
          url: "https://classify.roboflow.com/garmint-classification/1",
          params: {
              api_key: flowKeys.classification,
          },
          data: newGarmint,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          .then(({ data }) => {
            // console.log(data)
            // overly complicated method of reducing the keys array to the maximum value excluding 'Other' and 'Accessories
            const typePrediction = Object.keys(data.predictions)
              .filter((item) => item != 'Other' && item != 'Accessories')
              .reduce((a, b) => data.predictions[a].confidence > data.predictions[b].confidence ? a : b)
            // console.log('type?', typePrediction)
            setGarmintType(typePrediction)
            setclassifyingGarmint(false)
            stopper = true
          })
          .catch((err) => {
            console.log(err)
            stopper = true
          })
      }
    }
  }, [canvasRef, refresh])

  const checkSeason = () => {
    if (checkWinter.current && checkFall.current && checkSpring.current && checkSummer.current) {
      checkWinter.current.checked = (low < 49)
      checkFall.current.checked = (low < 66 && high > 48)
      checkSpring.current.checked = (high > 65 && low < 83)
      checkSummer.current.checked = (high > 82)
    }
  }

  const confirmGarmint = () => {
    let typeString = ''
    if (checkTop.current?.checked) typeString += 'top:'
    if (checkBottom.current?.checked) typeString += 'bottom:'
    if (checkOuter.current?.checked) typeString += 'outer:'
    typeString = typeString.split(':').filter((type) => type).join(':')

    let colorString = ''
    if (checkBlack.current?.checked) colorString += 'black:'
    if (checkBlue.current?.checked) colorString += 'blue:'
    if (checkBrown.current?.checked) colorString += 'brown:'
    if (checkGreen.current?.checked) colorString += 'green:'
    if (checkGrey.current?.checked) colorString += 'grey:'
    if (checkOrange.current?.checked) colorString += 'orange:'
    if (checkPurple.current?.checked) colorString += 'purple:'
    if (checkRed.current?.checked) colorString += 'red:'
    if (checkYellow.current?.checked) colorString += 'yellow:'
    if (checkWhite.current?.checked) colorString += 'white:'
    if (checkMulti.current?.checked) colorString += 'multicolored'
    colorString = colorString.split(':').filter((color) => color).join(':')

    let styleString = ''
    if (checkActive.current?.checked) styleString += 'active:'
    if (checkCasual.current?.checked) styleString += 'casual:'
    if (checkFormal.current?.checked) styleString += 'formal:'
    if (checkWork.current?.checked) styleString += 'work:'
    if (checkBusinessCasual.current?.checked) styleString += 'businessCasual'

    // check here for missing styles, since seasons will go here also
    if (!styleString) setMissingStyle(true)

    if (checkSpring.current?.checked) styleString += 'spring:'
    if (checkSummer.current?.checked) styleString += 'summer:'
    if (checkFall.current?.checked) styleString += 'fall:'
    if (checkWinter.current?.checked) styleString += 'winter:'
    styleString = styleString.split(':').filter((style) => style).join(':')

    // handle input errors, display messages based on state variables
    if (!typeString) setMissingType(true)
    if (!colorString) setMissingColor(true)

    // confirm strings before proceeding, returning from above checks won't complete all
    if (typeString && colorString && styleString) {
      const picture = canvasRef.current?.toDataURL('image/webp')
      // console.log(picture)
      // console.log(colorString, styleString)
      const Item = Garmint.fromJson({
        owner_id: user.username,
        item_number: appContext.garmintCount + 1,
        colors: colorString,
        styles: styleString,
        low_temp: low,
        high_temp: high,
        type: typeString,
        image: picture,
        uses: parseInt(inputUses.current?.value!),
        worn: 0,
      })
      // console.log('garmint', Item)
      const params = {
        TableName: 'garmints',
        Item,
      }
      appContext.db.put(params, (err: any, data: any) => {
        console.log('db Add:', appContext)
        if (err) throw err
        // maybe initialize new class and assign values
        appContext.garmintCount++
        appContext.garmints.push(Item)
        // Item.type.includes('top') && appContext.tops.push(Item)
        // Item.type.includes('bottom') && appContext.bottoms.push(Item)
        // need to setup outerwear
        console.log('after add', appContext)
        // state updates require a new object
        const newContext = new AppInfo()
        setAppContext(Object.assign(newContext, appContext))
        cleanState()
      })
    }
  }

  const cleanState = () => {
    predictions.splice(index, 1)
    camState.setPredictions(predictions)
    stopper = true
    if (!predictions.length) {
      camState.setProcessing(false)
      camState.setWebcamLoading(true)
    }
    camState.setImgError(false)
    setMissingType(false)
    setMissingColor(false)
    setMissingStyle(false)
  }

  const styleConfirmation: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '10px 10px 100px 8px var(--mint-shaded)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--amplify-colors-white)',
    width: image.width > 350 ? image.width + 35 : 385,
    fontWeight: 'bold',
    top: '25px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    zIndex: 99,
  }

  const styleDivider: React.CSSProperties = {
    width: image.width,
    borderColor: 'var(--burntOrange)',
    borderTopWidth: '3px',
    marginBottom: '7.5px',
  }

  const styleDividerError: React.CSSProperties = {
    width: image.width,
    borderColor: 'red',
    borderTopWidth: '4px',
    marginBottom: '7.5px',
  }

  const styleError: React.CSSProperties = {
    color: 'darkred'
  }

  const styleCloseButton: React.CSSProperties = {
    position: 'absolute',
    right: 7.5,
    top: 4.75,
    zIndex: 1,
    color: 'var(--mint)'
  }

  const styleGarmintCam: React.CSSProperties = {
    position: 'absolute',
    alignSelf: 'center',
    boxShadow: '0px 10px 100px 8px var(--mint-shaded)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--amplify-colors-white)',
    top: '25px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    zIndex: 99,
  }

  const styleClassify: React.CSSProperties = {
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
  }

  const styleSendButton: React.CSSProperties = {
    width: '100%',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
  }

  // probably needs grid layout to limit shitfing of columns in rows
  return (
    <> {classifyingGarmint ?
      <div style={styleGarmintCam}>
        <canvas
          ref={canvasRef}
          height={predictions[index].height}
          width={predictions[index].width}
          style={styleClassify}
        />
        <button
          className="newButton button:hover"
          style={styleSendButton}
          onClick={() => setclassifyingGarmint(false)}
        >Classifying Garmint</button>
      </div>
    : <div style={styleConfirmation} className='confirmation'>
      <FontAwesomeIcon
        icon={faWindowClose}
        style={styleCloseButton}
        onClick={cleanState}
      />
      <p>Garmint Detected!</p>
      <div style={{width: image.width, height: image.height}}>
        <canvas
          ref={canvasRef}
          height={image.height}
          width={image.width}
          hidden={classifyingGarmint}
        />
      </div>
      <p>This looks like a...</p>
      <hr style={missingType ? styleDividerError : styleDivider} />
      {missingType && <small className='text-red-600 -mt-1.5 mb-1'>Required field</small>}
      <div className='flex justify-between items-center mb-2' style={{width: image.width}} >
        <GarmintCheckbox ref={checkTop} label='Top' />
        <GarmintCheckbox ref={checkBottom} label='Bottom' />
        <GarmintCheckbox ref={checkOuter} label='Outerwear' />
      </div>
      <p>It's colors are...</p>
      <hr style={missingColor ? styleDividerError : styleDivider} />
      {missingColor && <small className='text-red-600 -mt-1.5 mb-1'>Required field</small>}
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkBlack} label='Black' />
        <GarmintCheckbox ref={checkBlue} label='Blue' />
        <GarmintCheckbox ref={checkBrown} label='Brown' />
        <GarmintCheckbox ref={checkGrey} label='Grey' />
      </div>
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkGreen} label='Green' />
        <GarmintCheckbox ref={checkOrange} label='Orange' />
        <GarmintCheckbox ref={checkPurple} label='Purple' />
        <GarmintCheckbox ref={checkRed} label='Red' />
      </div>
      <div className='flex justify-around items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkYellow} label='Yellow' />
        <GarmintCheckbox ref={checkWhite} label='White' />
        <GarmintCheckbox ref={checkMulti} label='Multicolored' />
      </div>
      <p>What temperatures & season will it be worn in?</p>
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
      <div className='flex justify-between items-center mb-3 mt-1 -ml-1' style={{width: image.width}} >
        <GarmintCheckbox ref={checkWinter} label='Winter' />
        <GarmintCheckbox ref={checkFall} label='Fall' />
        <GarmintCheckbox ref={checkSpring} label='Spring' />
        <GarmintCheckbox ref={checkSummer} label='Summer' />
      </div>
      <p>What style of clothing is it?</p>
      <hr style={missingStyle ? styleDividerError : styleDivider} />
      {missingStyle && <small className='text-red-600 -mt-1.5 mb-1'>Required field</small>}
      <div className='flex justify-between items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkActive} label='Active' />
        <GarmintCheckbox ref={checkCasual} label='Casual' />
        <GarmintCheckbox ref={checkFormal} label='Formal' />
        <GarmintCheckbox ref={checkWork} label='Work' />
      </div>
      <div className='flex justify-around items-center mb-3' style={{width: image.width}} >
        <GarmintCheckbox ref={checkBusinessCasual} label='Business Casual' />
      </div>
      <div className='flex justify-around items-center' >
        <p>How many uses before washing?</p>
        <input
          type='number'
          min='1'
          max='10'
          value={garmintUses}
          ref={inputUses}
          onChange={(e) => setGarmintUses(e.target.valueAsNumber)}
          style={{width: '40px', marginLeft: '20px'}}
        />
      </div>
      <hr style={styleDivider} />
      <div className='flex justify-around items-center w-full'>
        <button onClick={cleanState} className='button mb-2' >Discard</button>
        <button onClick={confirmGarmint}  className='button mb-2' >Confirm</button>
      </div>
    </div>
    } </>
  )
}
