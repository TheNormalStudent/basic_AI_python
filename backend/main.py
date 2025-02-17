import numpy as np
from backprop import backprop
import matplotlib.pyplot as plt
import pandas as pd


def sigmoid(arr):
  return 1 / (1 + np.exp(-1 * arr))

def feed_forward(arr, WX, bx, n):
    cache_of_AX = []
    cache_of_AX.append(arr)

    for i in range(1, len(n)):
        Z = WX[i - 1] @ arr + bx[i - 1]
        arr = sigmoid(Z)
        cache_of_AX.append(arr)

    return cache_of_AX


def cost_count(hat_y, y):
    losses = - ( (y * np.log(hat_y)) + (1 - y) * np.log(1 - hat_y) )

    m = hat_y.reshape(-1).shape[0]

    summed_losses = (1 / m) * np.sum(losses, axis=1)

    return np.sum(summed_losses)

def prepare_data(data, data_result, n):
    X__initial_data = np.array(data)

    y__initial_data_result_set  = np.array(
        data_result
    )
    m = len(y__initial_data_result_set)

    Y = y__initial_data_result_set.reshape(n[len(n)-1], m) # reshaping so that rows of first equals columns of last

    A0 = X__initial_data.T

    return A0, Y, m

def train(data):
    epochs = 1000 # training for 1000 iterations
    alpha = 0.0001 # set learning rate to 0.1
    costs = [] # list to store costs

    initial_data_result = np.array(data['result'].values.tolist())
    
    data = np.array(data.drop(columns=['result']).values.tolist())

    n = [len(data.T)] + [len(data.T) + 1 for _ in range(0, 11)] + [1] # architecture of a neural network
    A0, Y, m = prepare_data(data=data, data_result=initial_data_result, n=n)

    WX = [] 

    for i in range(0, len(n)-1): # initializing random weights for all of our connections W1 = 2 x 3, W2 = 3 X 3, W3 = 3 x 1
        WX.append(np.random.randn(n[i+1], n[i]))

    bx = []

    for i in range(1, len(n)): # initializing random biases for all of our connections b1 = 2 x 1, b2 = 3 X 1, b3 = 3 x 1
        bx.append(np.random.randn(n[i], 1) )

    for e in range(epochs):
        # 1. FEED FORWARD
        AX_cache = feed_forward(A0, WX, bx, n)

        # 2. COST CALCULATION
        error = cost_count(AX_cache[len(AX_cache)-1], Y)
        costs.append(error)

        # 3. BACKPROP CALCULATIONS

        weights_backprop, biases_backprop = backprop(AX_cache, WX, n, m, Y)

        # 4. UPDATE WEIGHTS
        for i in range(0, len(WX)):
            WX[i] = WX[i] - (alpha * weights_backprop[i])

        for i in range(0, len(bx)):
            bx[i] = bx[i] - (alpha * biases_backprop[i])


    return costs, WX, bx

def test(data, WX, bx):
    data_true_results = np.array(data['result'].values.tolist())
    data_to_feed = np.array(data.drop(columns=['result']).values.tolist())

    n = [len(data_to_feed.T)] + [len(data_to_feed.T) + 1 for _ in range(0, 11)] + [1]
    data_to_feed, _, _ = prepare_data(data_to_feed, data_true_results, n)
    
    result = feed_forward(data_to_feed, WX, bx, n)[-1][0]

    print('hi')
    print(result)

    correct = 0

    for i in range(0, len(result)):
        if((data_true_results.tolist())[i] == int(round(result[i], 0))):
            correct += 1

    print(f"Correct: {correct}\nTotal: {len(result)}")


df = pd.read_csv('cancer.csv')
df_train = df[:int(len(df) * 0.9)]
df_test = df[int(len(df) * 0.9):]

costs, WX, bx = train(df_train)
test(df_test, WX, bx)

plt.plot([i for i in range(0, 1000)], costs)
plt.show()