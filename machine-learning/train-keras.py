import pandas as pd
import numpy as np
import keras
import tensorflow as tf
from sklearn.model_selection import train_test_split


def create_model():
      model = keras.models.Sequential()
      model.add(keras.layers.Dense(4, input_dim=3, activation='relu'))
      model.add(keras.layers.Dense(4, activation='relu'))
      model.add(keras.layers.Dense(1, activation='sigmoid'))
      model.compile(loss='binary_crossentropy', optimizer='adam',  metrics=['accuracy'])
      return model;


df = pd.read_csv('tennis-result-2.csv')

properties = list(df.columns.values)
properties.remove('matchDate')
properties.remove('isBagel')
properties.remove('score')
properties.remove('WinOrLose')


x = df[properties]
y = df['WinOrLose']
print(x)
x = x.values
y = y.values

X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)


training_model = create_model();
training_model.fit(X_train, y_train, epochs=50, batch_size=1)
test_loss, test_acc = training_model.evaluate(X_test, y_test)
print('Test accuracy:', test_acc)



x_predict = np.array([[0.05, 0.1, 0 ], [0.7, 0.55, 0]])

##result = training_model.predict_classes(x_predict)




# serialize model to JSON
model_json = training_model.to_json()
with open("model/model.json", "w") as json_file:
    json_file.write(model_json)
# serialize weights to HDF5
training_model.save("model/model.h5")


training_model.save_weights("model/model_weight.h5")




## load model and score
loaded_model = create_model();
loaded_model.load_weights("model/model_weight.h5")
result = loaded_model.predict_classes(x_predict)
print(result)
