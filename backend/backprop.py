import numpy as np
import time

def backprop_layer_last_layer(AX_list, Y, m, n, WX_LIST):

    A3 = AX_list[len(AX_list)-1]

    # step 1. calculate dC/dZ3 using shorthand we derived earlier
    dC_dZLAST = (1/m) * (A3 - Y)

    # step 2. calculate dC/dW3 = dC/dZ3 * dZ3/dW3 
    #   we matrix multiply dC/dZ3 with (dZ3/dW3)^T
    dZLAST_dWLAST = AX_list[len(AX_list)-2]

    dC_dWLAST = dC_dZLAST @ dZLAST_dWLAST.T

    # step 3. calculate dC/db3 = np.sum(dC/dZ3, axis=1, keepdims=True)
    dC_dbLAST = np.sum(dC_dZLAST, axis=1, keepdims=True)

    # step 4. calculate propagator dC/dA2 = dC/dZ3 * dZ3/dA2
    dZLAST_dALAST_MIN_1 = WX_LIST[len(WX_LIST)-1]
    dC_dALAST_MIN_1 = dZLAST_dALAST_MIN_1.T @ dC_dZLAST

    return dC_dWLAST, dC_dbLAST, dC_dALAST_MIN_1



def calculate_dC_dWX(AX_min_1, dC_DZX, n, m, X):
    dZX_dWX = AX_min_1

    dC_dWX = dC_DZX @ dZX_dWX.T

    return dC_dWX

def calculate_dc_dbX(dC_dZX, n, X):
    dC_dbX = np.sum(dC_dZX, axis=1, keepdims=True)

    return dC_dbX

def calculate_propagator_dC_dAX_min_1(WX, dC_dZX, n, m, X):
    dC_dA2 = WX.T @ dC_dZX
    assert dC_dA2.shape == (n[X-1], m)

    return dC_dA2

def backprop_layer_X(AX_LIST,propagator_dC_dAX, WX_LIST, n, m, X): # x = 2

    # step 1. calculate dC/dZ2 = dC/dA2 * dA2/dZ2

    # use sigmoid derivation to arrive at this answer:
    #   sigmoid'(z) = sigmoid(z) * (1 - sigmoid(z))
    #     and if a = sigmoid(z), then sigmoid'(z) = a * (1 - a)
    dAX_dZX = AX_LIST[X] * (1 - AX_LIST[X])
    dC_dZX = propagator_dC_dAX * dAX_dZX

    dC_dWX = calculate_dC_dWX(AX_LIST[X-1], dC_dZX, n, m, X)

    dc_dbX = calculate_dc_dbX(dC_dZX, n, X)

    dC_dAX_min_1 = calculate_propagator_dC_dAX_min_1(WX_LIST[X-1], dC_dZX, n, m, X)
    if(X == 1): dC_dAX_min_1 = None

    return dC_dWX, dc_dbX, dC_dAX_min_1

def backprop(AX_LIST, WX_LIST, n, m, Y, visualization_callback, delay):
    dC_dWX_LIST_reversed = []
    dC_dbX_LIST_reversed = []
    dC_dAX_min_1_LIST_reversed = []

    dC_dWX, dC_dbX, dC_dAX_min_1 =  backprop_layer_last_layer(AX_LIST, Y, m, n, WX_LIST)

    dC_dWX_LIST_reversed.append(dC_dWX)
    dC_dbX_LIST_reversed.append(dC_dbX)
    dC_dAX_min_1_LIST_reversed.append(dC_dAX_min_1)

    for X in range(len(n)-2, 0, -1):
        dC_dWX, dC_dbX, dC_dAX_min_1 = backprop_layer_X(AX_LIST, dC_dAX_min_1, WX_LIST, n, m, X)
        visualization_callback(X, "backpropagation")
        time.sleep(delay)
        dC_dWX_LIST_reversed.append(dC_dWX)
        dC_dbX_LIST_reversed.append(dC_dbX)
        if(type(dC_dAX_min_1) == None): dC_dAX_min_1_LIST_reversed.append(dC_dAX_min_1)

    return dC_dWX_LIST_reversed[::-1], dC_dbX_LIST_reversed[::-1]