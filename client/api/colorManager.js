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
