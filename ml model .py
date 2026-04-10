import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset
X = np.array([1, 2, 3, 4, 5]).reshape(-1,1)
y = np.array([30, 35, 45, 50, 60])

# Create model
model = LinearRegression()

# Train model
model.fit(X, y)

# Prediction
experience = np.array([[6]])
prediction = model.predict(experience)

print("Predicted Salary:", prediction)