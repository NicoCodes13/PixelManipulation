const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 522;
canvas.height = 418;

const image1 = new Image();
image1.src = './leon1.jpg';

image1.addEventListener('load', function () {
  ctx.drawImage(image1, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let particlesArray = [];
  const numberOfParticles = 5000;

  let mappedImage = [];
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      //prettier-ignore
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
      //prettier-ignore
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
      //prettier-ignore
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
      const brightness = calculateRelativeBrightnes(red, green, blue);
      const cell = [(cellBrightness = brightness)];
      row.push(cell);
    }
    mappedImage.push(row);
  }

  console.log(mappedImage);

  function calculateRelativeBrightnes(red, green, blue) {
    return (
      Math.sqrt(
        //prettier-ignore
        (red*red) * 0.299 +
        (green * green) * 0.587 +
        (blue * blue) * 0.114
      ) / 100
    );
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 1.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
    }
    update() {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = mappedImage[this.position1][this.position2][0];
      //prettier-ignore
      let movent = (2.5 - this.speed) + this.velocity;

      this.y += movent;
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  init();

  function animate() {
    // ctx.drawImage(image1, 0, 0);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      ctx.globalAlpha = particlesArray[i].speed * 0.5;
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
  // const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // console.log(scannedImage);
  // const scannedData = scannedImage.data;
  // for (let i = 0; i < scannedData.length; i += 4) {
  //   const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
  //   const averageColorValue = total / 3;
  //   scannedData[i] = averageColorValue;
  //   scannedData[i + 1] = averageColorValue;
  //   scannedData[i + 2] = averageColorValue;
  // }
  // scannedImage.data = scannedData;
  // ctx.putImageData(scannedImage, 0, 0);
});
