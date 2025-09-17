// cameraValidation.js
// Drop-in utility for real-time camera validation in PWA
// Use: const result = await validateFrame(videoEl); -> { checks:[...], scores:{...} }

export async function validateFrame(videoOrCanvas) {
  const {width, height, ctx, off} = getCtx(videoOrCanvas);

  // 1) grab pixels (downscale to 256px max for speed)
  const target = scaleTo(off, ctx, width, height, 256);
  const g = target.ctx;
  const img = g.getImageData(0, 0, target.w, target.h);
  const {data} = img;

  // 2) luminance stats (lighting)
  let sum=0, sum2=0, n=target.w*target.h;
  let under=0, over=0;
  for (let i=0;i<data.length;i+=4){
    const y = 0.2126*data[i] + 0.7152*data[i+1] + 0.0722*data[i+2]; // [0..255]
    sum += y; sum2 += y*y;
    if (y < 40) under++;
    if (y > 235) over++;
  }
  const mean = sum/n;
  const std  = Math.sqrt(Math.max(0, (sum2/n) - (mean*mean)));
  const pctUnder = under/n*100;
  const pctOver  = over/n*100;

  // 3) sharpness (variance of Laplacian on grayscale)
  const gray = new Uint8ClampedArray(n);
  for (let i=0,j=0;i<data.length;i+=4,j++) gray[j] = (0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2])|0;

  const lap = [[0,1,0],[1,-4,1],[0,1,0]];
  let lapSum=0, lapSum2=0, count=0;
  for (let y=1;y<target.h-1;y++){
    for (let x=1;x<target.w-1;x++){
      const idx = y*target.w + x;
      const v =
        gray[idx-target.w]     * lap[0][1] +
        gray[idx-1]            * lap[1][0] +
        gray[idx]              * lap[1][1] +
        gray[idx+1]            * lap[1][2] +
        gray[idx+target.w]     * lap[2][1];
      lapSum += v; lapSum2 += v*v; count++;
    }
  }
  const sharpnessVar = (lapSum2/count) - Math.pow(lapSum/count, 2); // higher = sharper

  // 4) glare (near-white, low-saturation pixels)
  let glare=0;
  for (let i=0;i<data.length;i+=4){
    const r=data[i], g2=data[i+1], b=data[i+2];
    const max = Math.max(r,g2,b), min = Math.min(r,g2,b);
    const sat = (max===0)?0:(1 - (min/max)); // [0..1]
    const bright = max>=245;
    if (bright && sat < 0.12) glare++;
  }
  const glarePct = glare/n*100;

  // Thresholds (tune if needed)
  const lightingOK = mean>=90 && mean<=200 && pctUnder<35 && pctOver<5 && std>25;
  const focusOK    = sharpnessVar > 90;   // 60–120 typical; raise if too lenient
  const glareOK    = glarePct < 1.5;

  return {
    checks: [
      { text: "Photo has good lighting", isMet: lightingOK },
      { text: "Details are in focus",   isMet: focusOK },
      { text: "There is no glare",      isMet: glareOK },
    ],
    scores: {
      exposureMean: mean, exposureStd: std,
      underExposedPct: pctUnder, overExposedPct: pctOver,
      sharpnessVar, glarePct,
      w: target.w, h: target.h
    }
  };
}

// ---- helpers ----
function getCtx(videoOrCanvas){
  if (videoOrCanvas instanceof HTMLVideoElement){
    const w = videoOrCanvas.videoWidth;
    const h = videoOrCanvas.videoHeight;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoOrCanvas, 0, 0, w, h);
    return {width:w, height:h, off, ctx};
  } else if (videoOrCanvas instanceof HTMLCanvasElement){
    return {
      width: videoOrCanvas.width,
      height: videoOrCanvas.height,
      off: videoOrCanvas,
      ctx: videoOrCanvas.getContext('2d', { willReadFrequently: true })
    };
  }
  throw new Error("Pass a <video> or <canvas> element.");
}

function scaleTo(sourceCanvas, ctx, w, h, maxSide){
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const tw = Math.max(1, Math.round(w*scale));
  const th = Math.max(1, Math.round(h*scale));
  if (scale === 1) return {ctx, w, h};
  const t = document.createElement('canvas');
  t.width = tw; t.height = th;
  t.getContext('2d').drawImage(sourceCanvas, 0, 0, w, h, 0, 0, tw, th);
  return {ctx: t.getContext('2d', { willReadFrequently: true }), w: tw, h: th};
}

// PWA-friendly camera utilities
export async function startCamera(constraints = { video: { facingMode: "user" } }) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error('Camera access denied or not available');
  }
}

export function stopCamera(stream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

export function capturePhoto(videoElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  ctx.drawImage(videoElement, 0, 0);
  
  return canvas.toDataURL('image/jpeg', 0.8);
}
