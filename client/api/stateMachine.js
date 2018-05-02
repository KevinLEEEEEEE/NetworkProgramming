import errorHandler from '../api/errorhHandler';

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
