import json
import numpy as np
import os
import keras

#from azureml.assets.persistence.persistence import get_model_path
from azureml.core.model import Model
import logging


def init():
    logging.basicConfig(level=logging.DEBUG)
    logging.info("we are in init")
    print(Model.get_model_path(model_name='ml-ws-keras-weight-ddd'))
    logging.info("we are loading model")

    logging.info("model loaded")

def run(raw_data):
    try:
        logging.basicConfig(level=logging.DEBUG)
        logging.info("we are in scoring")
        print(Model.get_model_path(model_name='ml-ws-keras-weight-ddd'))
        logging.info("we are loading model")
        model_root = Model.get_model_path(model_name='ml-ws-keras-weight-ddd')

        model = keras.models.Sequential()
        model.add(keras.layers.Dense(4, input_dim=4, activation='relu'))
        model.add(keras.layers.Dense(4, activation='relu'))
        model.add(keras.layers.Dense(1, activation='sigmoid'))
        model.compile(loss='binary_crossentropy', optimizer='adam',  metrics=['accuracy'])
        model.load_weights(model_root)

        # logging.info("model loaded")
        # logging.info(raw_data)
        data = np.array(json.loads(raw_data)['data'])
        # logging.info(data)
        # make prediction
        # logging.info('ready to predict')
        result = model.predict_classes(data)
        # logging.info(result)
        return result.tolist()
    except Exception as e:
        return json.dumps({"error": str(e)})
