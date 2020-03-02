// https://github.com/nvhoanganh/tennis-schiit/blob/master/machine-learning/model/model.json
const tf = require("@tensorflow/tfjs");

async function load() {
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/nvhoanganh/tennis-schiit/master/machine-learning/model/output/model.json"
  );
  // The first argument is the data, and the second is the shape.
  let inputData = tf.tensor2d([[0.85, 0.05, 0]], [1, 3]);
  let result = model.predict(inputData);
  console.log(result.dataSync());

  inputData = tf.tensor2d([[0.05, 0.85, 0]], [1, 3]);
  result = model.predict(inputData);
  console.log(result.dataSync());

  inputData = tf.tensor2d([[0.95, 0.95, 0]], [1, 3]);
  result = model.predict(inputData);
  console.log(result.dataSync());
}

// JavaScript
load();
// Get measurements for a new flower to generate a prediction
