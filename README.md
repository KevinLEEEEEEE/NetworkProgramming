# NetworkProgramming
<p>This is the first time that I deal with the README of my programe in English, so mistakes are inevitable, please read with patience and tolerance.And as I thought out and wrote this message simultaneously, complex languang structure will not be adopted!Tnanks.</p>

<h2>> the goals achieved and the opposite:</h2>

> <h5>Design</h5>

>> - [x] the simple design: user interface
>> - [ ] the further design: user's experience

> <h5>Front Desk</h5>

>> - [x] the use of Vue.js
>> - [ ] the perfect use of components and modular programming
>> - [x] the use of api
>> - [x] image compress and clip function
>> - [ ] further develope the clip function the performance
>> - [x] write a stateMachine for the control of states
>> - [x] ensure the usability of the front desk
>> - [x] errorHandler module(consoleError haha!)
>> - [ ] the proformance of the website
>> - [ ] some points I can't call back to my mind, a pity

> <h5>End Desk</h5>

>> - [x] the use of express
>> - [ ] further use of express
>> - [x] image conpress and the use of thumbnail
>> - [x] the development of listManager(simple version of database)


<h2>> the following content consists of three major parts:</h2>
<ul>
  <li>the design and art work:  <i>brief description of the design of the webpages</i></li>
  <li>the front desk:  <i>the major part, detailed information</i></li>
  <li>the end desk:  <i>nodejs - express</i></li>  
</ul>
 

<h4>> PART1: Design</h4>
<img src="http://imgsrc.baidu.com/forum/w%3D580/sign=65442bf6acec08fa260013af69ef3d4d/fef6b4d12f2eb9380917f5bbd9628535e5dd6f17.jpg" />
<p>this is the finished edition of the design, and what's up there is where the downloaded img exists, it uses <b>'float' with a fixed 200px width</b> to achieve the waterfall layout, in that box, detailed information with <b>CSS animations added</b>, the name of the img and author is showed all the time and <b>'hover'</b> will trigger the animation and other messages appears: tags and likes as well as the major color of the image</p>

<img src="http://imgsrc.baidu.com/forum/w%3D580/sign=3272225b7e0e0cf3a0f74ef33a47f23d/054071deb48f8c5436ce4a6636292df5e0fe7f68.jpg" />
<p>As for this part, obviously, it is the <b>upload component</b> of the website, I use the <b>design pattern of 'bilibili' for reference</b>, so it might looks alike, but, not the same, for the use of clipping function, the container must be big enough to hold the entire image, by the way, and add btn will notice the programe to add a new box, the the box itself will <b>be destoryed after the message is sent</b> to the server successfully<p>


<h4>> PART2: Front desk</h4>
<img src="http://imgsrc.baidu.com/forum/w%3D580/sign=7026d9415f43fbf2c52ca62b807fca1e/570ec334970a304e93655cb3ddc8a786c8175cc2.jpg" />
<p>Here is the file structure, owing to the use of <b>Vue.js</b> and <b>webpack</b>, I use the engineering developed, butthat's not thatmajor part, I wrote the notes everywhere in the js file, so, more detailed information can be found there, I will focus on the <b>stateMachine</b> build inside the programe, it is a vital part, here is the code:</p>

```javascript
  export default function (machine, that) {
  try {
    StMaTest.isCorrect(machine);
  } catch (err) {
    errorHandler.consoleError(err);
    return false;
  }

  const stateMachine = {};
  const stateList = machine.states;
  const methodsList = machine.methods;
  const target = StMaTest.hasProp(that, '_data') ? that._data : that;

  Object.setPrototypeOf(methodsList, {
    stateChange(obj) {
      Object.keys(obj).map((key) => {
        target[key] = obj[key];
      });
    },
  }); // set its propotype for the transition`s availability

  Object.setPrototypeOf(stateList, {
    hasTranfer(from, to) {
      return this[from].indexOf(to) > -1;
    },
  }); // set its propotype for the transition`s availability

  Object.setPrototypeOf(stateMachine, {
    can(state) {
      if (stateList.hasTranfer(this.state, state)) {
        return true;
      }
      return false;
    },
    stateList,
    methodsList,
  }); // the 'can transition' method of the external interface

  Object.defineProperty(stateMachine, 'state', {
    get() {
      return this._state_;
    },
    set(state) {
      if (StMaTest.hasProp(stateList, state)) {
        this._state_ = state;
        const capitalBlock = state.substring(0, 1).toUpperCase() + state.substring(1);
        this.methodsList[`to${capitalBlock}`](); // capital block
      } else {
        throw new Error(`undefined state: ${state}`);
      }
    },
  }); // define the state prop using ES6

  stateMachine.state = stateList.init; // init

  return stateMachine;
}
 ```
 
 <p>with build in notes, it's not difficult to understand, and with the basic function, I sitll create a Object <b>especially for the ckeck ability</b>, to ensure the stateMachine is <b>strong enoug</b> after created and warn the possible mistake made inadvertently</p>
 
  ```javascript
  const StMaTest = {
  isCorrect(machine) {
    if (!this.hasProp(machine, 'states')) {
      throw new Error('Please define states'); // whether the machine Object is complete
    }

    if (!this.hasProp(machine, 'methods')) {
      throw new Error('Please define methods'); // whether the machine Object is complete
    }

    const keys = Object.keys(machine.states);
    const transitionArrray = [];
    const init = keys.splice(keys.indexOf('init'), 1); // get all user defined states without 'init'

    if (init === '' || machine.states[init] === '') {
      throw new Error('error with init'); // error with init, undefined or empty value
    }

    keys.map((key) => {
      machine.states[key].map((transition) => {
        if (keys.indexOf(transition) === -1) {
          throw new Error(`transition ${transition} undefined`);
        } else {
          transitionArrray.push(transition); // get all the transition methods for further test
        }
      }); // whether all transition methods in state array is a defined state

      const methodsName = this.getMethodsName(key);
      if (!this.hasProp(machine.methods, methodsName)) {
        throw new Error(`methods: ${methodsName} is undefined`);
      } // whether the methods called during the transition is defined
    });

    keys.map((key) => { // whether the key in states array has its own methods and transition
      if (transitionArrray.indexOf(key) === -1
          && this.hasProp(machine.methods, this.getMethodsName(key))
          && key !== machine.states.init) {
        throw new Error(`unused states: ${key}`);
      }
    });

    return true; // correct stateMachine! return true!
  },
  getMethodsName(string) {
    return `to${string.substring(0, 1).toUpperCase()}${string.substring(1)}`;
  },
  hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  },
};
```

<img src="http://imgsrc.baidu.com/forum/w%3D580/sign=f11ecca8232eb938ec6d7afae56385fe/780a8cf41bd5ad6e783daba38dcb39dbb7fd3c41.jpg" />
  <p>That's all for the stateMachine, then comes the special dish - <b>color Analysis feature</b>, it's a webworker(thread) which pick up the major color of the image then report to the server for the actualization of searching and filtering the image by color, that a common demand when an artist what to find more pictures <b>according to the use of color, tone, color tendencies</b> and so on, codes are as follows</p>
 
```javascript
import work from 'webworkify-webpack';

const colorManager = {
  proceessData(data) {
    const worker = work(require.resolve('../api/colorAnalysis.js'));
    return new Promise((resolve, reject) => {
      worker.addEventListener('message', (event) => {
        resolve(event.data);
      });

      worker.addEventListener('error', (event) => {
        reject(event);
      });

      worker.postMessage(data); // send the worker a message
    });
  },
};

export default colorManager;
# build for production and view the bundle analyzer report
npm run build --report
```

<p>this allows the program to <b>start a new thread</b> to deal with the color data, about 5 million RGB info(done in 1 seconds), not a high score, but acceptable on the V8 engine</p>

```javascript
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
```

<p>To transition color data between HSV and RGB, you know the javascript is pool in high precision calculation, so the normal formula didn't work, that all, the F*** work!</p>

```javascript
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
```

<p>The external interface</p>

```javascript
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
```

<p>Generally speaking, <b>the main algorithm is to calculating the average value</b>. May be, somewhere out there, there existing a better and more accurate methods to handle the info, but that's not the point, though with that said, I still make a tiny effort to make it runs better.  Imagine an occasion, when some color in the image is a tiny fraction of the overall data, <b>but that color is so distinguished that, regardless of its amount, it should be considered a major color of the image.</b></p>

<p>So, the simple "average value" doesn't work so well on that condition, then I add <b>the concept of "distance" in to consideration</b>, beacuse that the analysis is running under the HSV color gamut, we can simply use the H part, then calculate the "distance" of specific by </p>

```javascript
finalObj[tmp] = Math.round((2 ** (distance / gap)) * (currentAmount / pixelAmount)) / 100;
```

<p>In that way, both the <b>"AMOUNT"</b> and the <b>"PARTICULARITY"</b> become the decisive measure, unfortunately, the result is not that optimistic, even a little bad, that's furter talk, the solution will appears at the bottom the the article as links</p>

<p>That's all for the front desk~</p>



<h4>> PART3: End desk</h4>

<p>Not much to talk, I have no further study on this part, the thumbnail is the only dessert, which produce a <b>"image_small.type"</b> with the maxWidth and maxHeight in <b>"300px"</b> so the website could read the compressed file first <b>to avoid too much consumption</b></p>

```javascript
const _fileManager = {
  rename(oldPath, author, imgName, tags, colorData, type, resolve, reject) {
    const md5 = this.getMD5(author, imgName, tags);
    const newPath = path.join(__dirname, `../dist/img/${md5}.${type}`);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log('rename error');
        reject(err);
      } else {
        this.thumbnail(md5, newPath, type);
        console.log('rename and move file successfully');
        resolve({
          author,
          imgName,
          md5,
          tags,
          type,
          colorData,
        });
      }
    });
  },
  getMD5(author, imgName, tags) {
    return MD5(author + imgName + tags + new Date()).words.join('');
  },
  thumbnail(md5, newPath, type) {
    gm(newPath)
      .resize(300, 300, '>')
      .strip()
      .autoOrient()
      .write(path.join(__dirname, `../dist/img/${md5}_small.${type}`),
        (err) => {
          if (err) {
            console.log(`resize error: ${err}`);
          }
        });
  },
};
```

<p>That's all for the end desk</p>


<h2>FAQ</h2>
<ol>
  <li>
    <p>Q: Can I open the file and view the result directlly?</p>
    <p>A: Noop~, run <b>"npm install" first</b></p>
  </li>
   <li>
    <p>Q: After that, can I?</p>
    <p>A: Noop~, this is an unfinished project, the further development didn't match the previous design, and when I realize that, the only choice is nothing but rewite the enire project</p>
<img src="https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=6ddc9ea36481800a7ae8815cd05c589f/8601a18b87d6277f22ab551420381f30e924fc65.jpg" />
     <p>But that impossible to rewite it, so, that what appears, you could run <b>"npm run dev"</b> and <b>"cd server" + "node app"</b> to run the saperate server and upload and download the image</p>
   </li>
  <li>
    <p>Q: I did what you said, why can't I download the image?</p>
    <p>A: When you download the image, the broswer send a copy of file list, which record the files you have downloaded and the files you uploaded, so unless you open a dozen of broswer or close and open a new window, you just can't get any file! heihei!</p>
  </li>
    <li>
    <p>Q: Where is the search function?</p>
    <p>A: No that function, OK! This an assignment, not my "dachuang", and the result of color analysising didn't meet my expectation, so I decided to cut off that function, or the total code lines are to meet 2000, that became hard to manage</p>
  </li>
</ol>


<h4>After all, I find a billion, a trillion loopholes in my programming ability, so I decided to "relearn" most of the existing knowledge and see you in summer vacation!</h4>


<h2>Reference</h2>
<h4>aaaaaa, too much to list, if you want some of the data, contect mw with QQ, welcome and discussion concerning: <b>"front desk"</b>, <b>"end desk"</b>,  <b>"Vue.js"</b>,  <b>"cocos creater - a game engine based on javascript"</b>, and wish you a happy college life~</h4>
