var video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  // register parts of face
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // detect where the face is
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // detect happy , sad , etc
  faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.log(err)
  );
}

// when the video play
video.addEventListener("play", () => {
  // display canvas over video
  var canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  var displaySize = {
    width: video.width,
    height: video.height
  };

  faceapi.matchDimensions(canvas, displaySize);

  //   run code multiple times
  setInterval(async () => {
    // detect all faces inside the web cam , when this called
    const detections = await faceapi
      .detectAllFaces(
        video,
        // detect faces with face landmark , draw the face on screen , different dots on screen
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      // determine whether happy sad
      .withFaceExpressions();

    //   clear the canvas before draw

    const resizeDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    //   draw canvas
    faceapi.draw.drawDetections(canvas, resizeDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
  }, 100);
});
