import Image from 'next/image'
import mintLeaf from '../public/assets/mintLeaf.png'
import maleRestRoom from '../public/assets/maleRestroom.png'

export default function Loading({ width, height }: { width: number, height: number }) {
  const styleLoading: React.CSSProperties = {
    position: 'relative',
    borderRadius: '50%',
    width: width,
    height: height,
    backgroundColor: 'var(--amplify-colors-white)',
  }

  const styleMan: React.CSSProperties = {
    position: 'absolute',
    top: '5.7%',
    left: '28.5%',
    width: '42.8%',
    height: '88.6%',
  }

  const styleLeaf: React.CSSProperties = height > 125 ?
    {
      position: 'absolute',
      top: '41.5%',
      left: '42%',
      width: '16%',
      height: '26.25%',
      animation: 'rotating 2s 0.25s linear infinite',
    } : {
      position: 'absolute',
      top: '31.5%',
      left: '35%',
      width: '30%',
      height: '49.5%',
      animation: 'rotating 2s 0.25s linear infinite',
    }
    // slightly bigger, just in case for > 125
    // {
    //   position: 'absolute',
    //   top: '38%',
    //   left: '39.75%',
    //   width: '20%',
    //   height: '33.05%',
    //   animation: 'rotating 2s 0.25s linear infinite',
    // }

  return (
    <div style={styleLoading}>
      <div style={styleMan}>
        <Image
          src={maleRestRoom}
          alt='Male restroom Symbaol'
          fill={true}
          sizes='100%'
        />
      </div>
      <div style={styleLeaf}>
        <Image
          src={mintLeaf}
          alt='mint leaf'
          fill={true}
          sizes='100%'
        />
      </div>
    </div>
  )
}
