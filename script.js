const TYPE_VIDEO = 'videoinput';

const TYPE_CONTINUOUS = 'continuous';

const constraints = {
  audio: false,
  video: { facingMode: 'environment' }
};

const video = document.querySelector('video');

const handleSuccess = (stream) => {
  try {
    const track = stream.getVideoTracks()[0];
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
    console.log('track', track);
    console.log('getCapabilities()', track.getCapabilities());
    console.log('getConstraints()', track.getConstraints());
    console.log('getSettings()', track.getSettings());

    const result = {
      track,
      settings: track.getSettings()
    };

    return result;
  } catch (exception) {
    throw exception;
  }
}

const handleError = (error) => {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  stream.getVideoTracks()[0].stop();

  getMediaAsync();
});

const getMedia = async (camera) => {
  const constraints = {
    audio: false,
    video: { facingMode: 'environment' }
  };

  if (camera) {
    constraints.video = {
      deviceId: camera.deviceId
    };
  }

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  return handleSuccess(stream);
};

const getMediaAsync = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log('devices', devices);

  const backCameras = devices.filter(({ kind, label }) => {
    return kind === TYPE_VIDEO && label.toLowerCase().includes('back');
  });

  if (backCameras.length > 0) {
    let idx = 0;

    let streamSettings = await getMedia(backCameras[idx]);
    console.log('streamSettings', streamSettings);

    video.onclick = async () => {
      idx++;
      streamSettings.track.stop();

      streamSettings = await getMedia(backCameras[idx % backCameras.length]);
      console.log('streamSettings', streamSettings);
    }
  } else {
    await getMedia();
  }
}

