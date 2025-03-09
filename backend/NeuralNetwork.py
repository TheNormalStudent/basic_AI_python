import numpy as np
from backprop import backprop
import matplotlib.pyplot as plt
import pandas as pd
import time

class NeuralNetwork():
    def __init__(self, architecture, epochs_count, alpha):
        self.epochs_count = epochs_count
        self.alpha = alpha
        self.architecture = architecture
        self.WX = []

        for i in range(0, len(architecture)-1): # initializing random weights for all of our connections W1 = 2 x 3, W2 = 3 X 3, W3 = 3 x 1
            self.WX.append(np.random.randn(architecture[i+1], architecture[i]))

        self.bx = []

        for i in range(1, len(architecture)): # initializing random biases for all of our connections b1 = 2 x 1, b2 = 3 X 1, b3 = 3 x 1
            self.bx.append(np.random.randn(architecture[i], 1) )

    def __prepare_data(self, data, data_result, n):
        X__initial_data = np.array(data)

        y__initial_data_result_set  = np.array(
            data_result
        )
        m = len(y__initial_data_result_set)

        Y = y__initial_data_result_set.reshape(n[len(n)-1], m) # reshaping so that rows of first equals columns of last

        A0 = X__initial_data.T

        return A0, Y, m

    def __sigmoid(self, arr):
        return 1 / (1 + np.exp(-1 * arr))
    
    def __feed_forward(self, arr, WX, bx, n):
        cache_of_AX = []
        cache_of_AX.append(arr)

        for i in range(1, len(n)):
            Z = WX[i - 1] @ arr + bx[i - 1]
            arr = self.__sigmoid(Z)
            cache_of_AX.append(arr)

        return cache_of_AX
    
    def __cost_count(self, hat_y, y):
        losses = - ( (y * np.log(hat_y)) + (1 - y) * np.log(1 - hat_y) )

        m = hat_y.reshape(-1).shape[0]

        summed_losses = (1 / m) * np.sum(losses, axis=1)

        return np.sum(summed_losses)
    
    def train(self, data, epoch_graph_callback, visualization_callback):
        epochs = self.epochs_count # training for 1000 iterations
        alpha = self.alpha # set learning rate to 0.1
        costs = [] # list to store costs

        initial_data_result = np.array(data['result'].values.tolist())
        
        data = np.array(data.drop(columns=['result']).values.tolist())

        A0, Y, m = self.__prepare_data(data=data, data_result=initial_data_result, n=self.architecture)
        for e in range(epochs):
            # 1. FEED FORWARD
            AX_cache = self.__feed_forward(A0, self.WX, self.bx, self.architecture)

            # 2. COST CALCULATION
            error = self.__cost_count(AX_cache[len(AX_cache)-1], Y)
            costs.append(error)

            # 3. BACKPROP CALCULATIONS

            weights_backprop, biases_backprop = backprop(AX_cache, self.WX, self.architecture, m, Y)

            # 4. UPDATE WEIGHTS
            for i in range(0, len(self.WX)):
                self.WX[i] = self.WX[i] - (alpha * weights_backprop[i])

            for i in range(0, len(self.bx)):
                self.bx[i] = self.bx[i] - (alpha * biases_backprop[i])
            print(e)
            epoch_graph_callback(e, error)
            # time.sleep(1)
        print('finished training model')

        return costs, self.WX, self.bx
    
    def test(self, data, WX, bx):
        data_true_results = np.array(data['result'].values.tolist())
        data_to_feed = np.array(data.drop(columns=['result']).values.tolist())

        data_to_feed, _, _ = self.__prepare_data(data_to_feed, data_true_results, self.architecture)
        
        result = self.__feed_forward(data_to_feed, WX, bx, self.architecture)[-1][0]

        print(result)

        correct = 0

        for i in range(0, len(result)):
            if((data_true_results.tolist())[i] == int(round(result[i], 0))):
                correct += 1

        return correct, result
    

# network = NeuralNetwork([30, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1], 1000, 0.0001)
# df = pd.read_csv('cancer.csv')
# df_train = df[:int(len(df) * 0.9)]
# df_test = df[int(len(df) * 0.9):]

# costs, WX, bx = network.train(df_train)
# network.test(df_test, WX, bx)

# plt.plot([i for i in range(0, 1000)], costs)
# plt.show()  