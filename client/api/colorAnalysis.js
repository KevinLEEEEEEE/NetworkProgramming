const _colorAnalysis = {
  getAverage(obj) {
    let count = 0;
    let total = 0;
    Object.keys(obj).map((key) => {
      count += obj[key];
      total += key * obj[key];
    });
    return Math.round(total / count);
  },
  getMax(obj, amount) {
    const max = {};
    for (let index = amount; index > 0; index -= 1) {
      max[index] = [0, 0];
    }
    Object.keys(obj).map((skey) => {
      const key = parseInt(skey, 10);
      const value = obj[key];
      let tmpAmount = amount;
      do {
        const tmpMax = max[tmpAmount][1];
        if (value > tmpMax) {
          if (tmpAmount > 1) {
            for (let index = 2; index <= tmpAmount; index += 1) {
              max[index - 1] = max[index];
            }
          }
          max[tmpAmount] = [key, value];
          break;
        }
        tmpAmount -= 1;
      } while (tmpAmount);
    });
    return max;
  },
  getMaxComputed(h, pixelAmount, amount) {
    const start = h[1][0];
    const end = h[amount][0];
    const gap = Math.abs(start - end);
    const hArray = [];
    const finalObj = {};
    Object.keys(h).map((skey) => {
      const key = parseInt(skey, 10);
      hArray.push(h[key][0]);
    });
    for (let index = hArray.length - 1; index >= 0; index -= 1) {
      const tmp = hArray[index];
      const currentAmount = h[index + 1][1];
      let distance = 0;
      for (let indexs = hArray.length - 1; indexs >= 0; indexs -= 1) {
        distance += Math.abs(hArray[indexs] - tmp);
      }
      finalObj[tmp] = Math.round((2 ** (distance / gap)) * (currentAmount / pixelAmount)) / 100;
    }
    return finalObj;
  },
};

const colorAnalysis = {
  rgbToHSV(r, g, b) {
    let h;
    let s;
    const v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    const diffc = function diffc(c) {
      return ((v - c) / 6 / diff) + (1 / 2);
    };

    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / v;
      const rr = diffc(r);
      const gg = diffc(g);
      const bb = diffc(b);

      if (r === v) {
        h = bb - gg;
      } else if (g === v) {
        h = ((1 / 3) + rr) - bb;
      } else if (b === v) {
        h = ((2 / 3) + gg) - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  },
  hsvToRGB(h, s, v) {
    let r;
    let g;
    let b;
    const i = Math.floor(h * 6);
    const f = (h * 6) - i;
    const p = v * (1 - s);
    const q = v * (1 - (f * s));
    const t = v * (1 - ((1 - f) * s));
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default:
    }
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
    ];
  },
  getHSVArray(rgba) {
    const hObject = {};
    const sObject = {};
    const vObject = {};
    for (let index = rgba.length; index > 0; index -= 4) {
      const r = rgba[index - 4] / 255;
      const g = rgba[index - 3] / 255;
      const b = rgba[index - 2] / 255;
      const hsv = this.rgbToHSV(r, g, b);
      if (hsv.h in hObject) {
        hObject[hsv.h] += 1;
      } else {
        hObject[hsv.h] = 1;
      }
      if (hsv.s in sObject) {
        sObject[hsv.s] += 1;
      } else {
        sObject[hsv.s] = 1;
      }
      if (hsv.v in vObject) {
        vObject[hsv.v] += 1;
      } else {
        vObject[hsv.v] = 1;
      }
    }
    return {
      hObject,
      sObject,
      vObject,
    };
  },
};

export default function worker(self) {
  self.addEventListener('message', (event) => {
    const maxRGBArray = [];
    const data = event.data;
    const pixelAmount = data.width * data.height;
    const hsv = colorAnalysis.getHSVArray(data.data);
    const averageS = _colorAnalysis.getAverage(hsv.sObject);
    const averageV = _colorAnalysis.getAverage(hsv.vObject);
    const maxH = _colorAnalysis.getMax(hsv.hObject, 20);
    const maxHSend = _colorAnalysis.getMax(hsv.hObject, 5);
    const maxHComputed = _colorAnalysis.getMaxComputed(maxH, pixelAmount, 20);
    const maxHC = _colorAnalysis.getMax(maxHComputed, 5);
    Object.keys(maxHC).map((key) => {
      const hsvArray = maxH[key];
      const h = parseInt(hsvArray[0], 10);
      const maxRGB = colorAnalysis.hsvToRGB(h / 360, averageS / 100, averageV / 100);
      maxRGBArray.push(maxRGB);
    });
    self.postMessage({
      h: maxHSend,
      s: averageS,
      v: averageV,
      rgb: maxRGBArray.reverse(),
    });
  });
}
