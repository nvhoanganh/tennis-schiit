// https://github.com/nvhoanganh/tennis-schiit/blob/master/machine-learning/model/model.json
const tf = require("@tensorflow/tfjs");

async function load() {
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/nvhoanganh/tennis-schiit/master/machine-learning/model/output/model.json"
  );
  // The first argument is the data, and the second is the shape.
  const inputData = tf.tensor2d([[0.95, 0.3, 0]], [1, 3]);

  // Get the highest confidence prediction from our model
  const result = model.predict(inputData);
  // const winner = irisClasses[result.argMax().dataSync()[0]];
  // Display the winner
  console.log(result);
}

// JavaScript
load();
// Get measurements for a new flower to generate a prediction
