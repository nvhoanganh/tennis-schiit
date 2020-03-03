import pandas as pd
import numpy as np
import keras
import tensorflow as tf
from sklearn.model_selection import train_test_split

# df = pd.read_csv('tennis-result-2.csv')
df = pd.read_csv('0oiWTODB7i2iXjCIMw1H.csv')

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

model = keras.models.Sequential()
model.add(keras.layers.Dense(4, input_dim=3, activation='relu'))
model.add(keras.layers.Dense(4, activation='relu'))
model.add(keras.layers.Dense(1, activation='sigmoid'))
model.compile(loss='binary_crossentropy', optimizer='adam',  metrics=['accuracy'])

model.fit(X_train, y_train, epochs=50, batch_size=1)
test_loss, test_acc = model.evaluate(X_test, y_test)
print('Test accuracy:', test_acc)



x_predict = np.array([[25, 9, 0 ], [8, 33, 0]])

result = model.predict_classes(x_predict)


print(result)

# serialize model to JSON
model_json = model.to_json()
with open("model.json", "w") as json_file:
    json_file.write(model_json)
# serialize weights to HDF5
model.save("model.h5")
