import Loading from '../ui-components/Loading'

export default function LoadingTeam() {

  const styleGarmintCam: React.CSSProperties = {
    position: 'absolute',
    alignSelf: 'center',
    boxShadow: '0px 0px 20px 20px black',
    // borderRadius: '0.5rem',
    backgroundColor: 'var(--amplify-colors-white)',
    top: '30%',
    left: '30%'
  }

  const styleSendButton: React.CSSProperties = {
    width: '100%',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderRadius: '0',
  }

  return (
    <div style={styleGarmintCam}>
      <Loading width={400} height={400} />
      <button
        className="newButton button:hover"
        style={styleSendButton}
      >
        Loading Team
      </button>
    </div>
  )
}
