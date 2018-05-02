# NetworkProgramming
<p>This is the first time that I deal with the README of my programe in English, so mistakes are inevitable, please read with patience and tolerance.And as I thought out and wrote this message simultaneously, complex languang structure will not be adopted!Tnanks.</p>


<h3>> the goals achieved and the opposite:</h3>

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
>> - [ ] errorHandler module(consoleError haha!)
>> - [ ] the proformance of the website

> <h5>End Desk</h5>

>> - [x] the use of express
>> - [ ] further use of express
>> - [x] image conpress and the use of thumbnail
>> - [x] the development of listManager(simple version of database)


<h3>> the following content consists of three major parts:</h3>
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
 
 <p>with build in notes, it's not difficult to understand, and with the basic function, I sitll create a Object especially for the ckeck function, to ensure the stateMachine is Strong when created and warn the possible mistake made inadvertently</p>
 
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
 
