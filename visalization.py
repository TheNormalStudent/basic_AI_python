import tkinter as tk
import math

def draw_neural_network(canvas, architecture, width, height, radius=20, spacing_x=150):
    max_neurons = max(architecture)
    spacing_y = height / (max_neurons + 1)

    layer_positions = []
    
    for i, neurons in enumerate(architecture):
        x = (i + 1) * spacing_x
        layer_y_positions = []
        
        for j in range(neurons):
            y = (j + 1) * spacing_y + (height - spacing_y * max_neurons) / 2
            canvas.create_oval(x - radius, y - radius, x + radius, y + radius, fill="white", outline="black")
            layer_y_positions.append((x, y))
        
        layer_positions.append(layer_y_positions)

    for i in range(len(layer_positions) - 1):
        for from_node in layer_positions[i]:
            for to_node in layer_positions[i + 1]:
                canvas.create_line(from_node[0], from_node[1], to_node[0], to_node[1])


def main(architecture):
    root = tk.Tk()
    root.title("Neural Network Visualizer")
    width = 700
    height = 500

    canvas = tk.Canvas(root, width=width, height=height, bg="white")
    canvas.pack()

    draw_neural_network(canvas, architecture, width, height)
    root.mainloop()

# Example architecture: [2, 3, 3, 1]
main([5, 7, 10, 1])