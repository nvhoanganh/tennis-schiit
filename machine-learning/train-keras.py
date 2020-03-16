# azureml-core of version 1.0.72 or higher is required
# azureml-dataprep[pandas] of version 1.1.34 or higher is required
from azureml.core import Workspace, Dataset
import pandas as pd
import numpy as np
import keras
from sklearn.model_selection import train_test_split
from azureml.core.model import Model





def create_model():
      model = keras.models.Sequential()
      model.add(keras.layers.Dense(4, input_dim=4, activation='relu'))
      model.add(keras.layers.Dense(4, activation='relu'))
      model.add(keras.layers.Dense(1, activation='sigmoid'))
      model.compile(loss='binary_crossentropy', optimizer='adam',  metrics=['accuracy'])
      return model;



subscription_id = '76d03a17-20be-4175-bbed-ca6d7819c68f'
resource_group = 'machine-learning'
workspace_name = 'ml-ws'

workspace = Workspace(subscription_id, resource_group, workspace_name)

dataset = Dataset.get_by_name(workspace, name='tennis-result-less-columns')
dataset = dataset.to_pandas_dataframe()


properties = list(dataset.columns.values)


x = dataset[properties]
y = dataset['WinOrLose']

x = x.values
y = y.values

X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)


training_model = create_model();
training_model.fit(X_train, y_train, epochs=50, batch_size=1)
test_loss, test_acc = training_model.evaluate(X_test, y_test)
print('Test accuracy:', test_acc)



x_predict = np.array([[1, 17, 0, 0 ], [31, 33, -1, 0]])

result = training_model.predict_classes(x_predict)




# serialize model to JSON
model_json = training_model.to_json()
with open("model/model.json", "w") as json_file:
    json_file.write(model_json)
# serialize weights to HDF5
training_model.save("model/model.h5")


training_model.save_weights("model/model_weight.h5")


# Register model weight
model = Model.register(workspace = workspace,
                        model_path ="model/model_weight.h5",
                        model_name = "ml-ws-keras-weight-ddd",
                        tags = {"for": "ddd night"},
                        description = "This is a sample Keras model trained by tennis result data for DDD night",)


## load model and score
# loaded_model = create_model();
# loaded_model.load_weights("model/model_weight.h5")
# result = loaded_model.predict_classes(x_predict)
# print(result)
