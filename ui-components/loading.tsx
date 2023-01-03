import Image from 'next/image'
import mintLeaf from '../public/assets/mintLeaf.png'
import MaleRestRoom from '../public/assets/maleRestroom.png'

export default function Loading() {
  const styleLoading={
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    width: 350,
    height: 350,
    backgroundColor: 'var(--amplify-colors-white)',
  }

  return (
    <div className='relative' style={styleLoading}>
      <div className='loadingMan'>
        <Image
          src={MaleRestRoom}
          alt='Male restroom Symbaol'
        />
      </div>
      <div className='loadingLeaf'>
        <Image
          src={mintLeaf}
          alt='mint leaf'
        />
      </div>
    </div>
  )
}
