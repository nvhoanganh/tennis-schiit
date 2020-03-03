/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// eslint-disable @typescript-eslint/no-var-requires

const tf = require("@tensorflow/tfjs-node");
async function load() {
  const model = await tf.loadLayersModel("file://model/output/model.json");
  // The first argument is the data, and the second is the shape.
  let inputData = tf.tensor2d([[28, 34, 0]], [1, 3]);
  let result = model.predict(inputData);
  console.log(result.dataSync());

  inputData = tf.tensor2d([[28, 5, 0]], [1, 3]);
  result = model.predict(inputData);
  console.log(result.dataSync());

  inputData = tf.tensor2d([[19, 37, 0]], [1, 3]);
  result = model.predict(inputData);
  console.log(result.dataSync());
}

// JavaScript
load();
// Get measurements for a new flower to generate a prediction
