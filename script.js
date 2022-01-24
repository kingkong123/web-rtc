const TYPE_VIDEO = 'videoinput';

const TYPE_CONTINUOUS = 'continuous';

const constraints = {
  audio: false,
  video: { facingMode: 'environment' }
};

const video = document.querySelector('video');
const div = document.querySelector('div');

const handleSuccess = (stream) => {
  try {
    const track = stream.getVideoTracks()[0];

    video.srcObject = stream;

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

  const backCameras = devices.filter(({ kind, label }) => {
    return kind === TYPE_VIDEO && label.toLowerCase().includes('back');
  });

  if (backCameras.length > 1) {
    div.innerHTML = `Number of back cameras: ${backCameras.length}`;
    let idx = 0;

    let streamSettings = await getMedia(backCameras[idx]);

    video.onclick = async () => {
      idx++;
      streamSettings.track.stop();

      streamSettings = await getMedia(backCameras[idx % backCameras.length]);
    }
  } else {
    div.innerHTML = 'Only 1 camera found';
    await getMedia();
  }
}
