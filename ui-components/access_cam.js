import { useState, useCallback } from "react";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "user" },
};

export const useUserMedia = (requestedMedia) => {
  const [mediaStream, setMediaStream] = useState(null);

  const handleSuccess = useCallback((stream) => {
    setMediaStream(stream);
  }, []);

  const handleError = useCallback((error) => {
    console.log(error);
  }, []);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          requestedMedia
        );
        handleSuccess(stream);
      } catch (err) {
        handleError(err);
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia, handleSuccess, handleError]);

  return mediaStream;
}
