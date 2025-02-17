import Block from '../Block/Block';
import {useState, useCallback, useRef, useEffect} from 'react'
import { height, padding, width } from '@mui/system';
import { MarginOutlined } from '@mui/icons-material';

function NetworkVisualization({ layers, children }){
    const max_good_drawn_layers = 10;
    const svgRef = useRef(null);
    const [svgSize, setSvgSize] = useState({width: 0, height: 0})

    useEffect(() => {
        if(svgRef.current)
            {
                setSvgSize({width: svgRef.current.clientWidth, height: svgRef.current.clientHeight})
            }
    }, []);

    const calculateY = (radius, svgHeight, neurons_count, index) => {
        const top_space = (svgHeight - neurons_count*radius*2)/2;
        return radius * index * 2 + top_space + radius;
    };

    const calculateX = (radius, svgWidth, layersLength, layerIdx) => {
        const spacing = (svgWidth - (radius * 2 * layersLength)) / (layersLength - 1);
        return radius + (spacing + radius * 2) * layerIdx;
    };

    function calculateRadius(height, width)
    {
        var potentialRadius = 20;
        if(layers.length > max_good_drawn_layers) potentialRadius = (width - width * 0.33) / (layers.length * 2);
        if(Math.max.apply(null, layers) * potentialRadius*2 > height)
            {
                var potentialMaxRadius = height / (Math.max.apply(null, layers) * 2)
                if(potentialMaxRadius < potentialRadius)
                    potentialRadius = potentialMaxRadius;
            }

        return potentialRadius;
    }

    return (
        <Block blockName={"Network Visualization"} >
            <svg width="100%" height="100%" ref={svgRef} >
                {svgSize.width > 0 && layers.map((neurons, layerIdx) => (
                    Array.from({ length: neurons }).map((_, neuronIdx) => {
                        const radius = calculateRadius(svgSize.height, svgSize.width)

                        if(layerIdx === 0) var x = radius;
                        else var x = calculateX(radius, svgSize.width, layers.length, layerIdx);
                        const y = calculateY(radius, svgSize.height, neurons,neuronIdx);
                        
                        // Draw connections to next layer
                        const lines = [];
                        if (layerIdx < layers.length - 1) {
                            const nextNeurons = layers[layerIdx + 1];
                            for (let nextNeuronIdx = 0; nextNeuronIdx < nextNeurons; nextNeuronIdx++) {
                                const nextX = calculateX(radius, svgSize.width, layers.length, layerIdx+1);
                                const nextY = calculateY(radius, svgSize.height, nextNeurons, nextNeuronIdx);
                                lines.push(
                                    <line
                                        key={`line-${layerIdx}-${neuronIdx}-${nextNeuronIdx}`}
                                        x1={x}
                                        y1={y}
                                        x2={nextX}
                                        y2={nextY}
                                        stroke="#333"
                                        strokeWidth="1"
                                    />
                                );
                            }
                        }

                        // Draw neuron circle
                        const circle = (
                            <circle
                                key={`neuron-${layerIdx}-${neuronIdx}`}
                                cx={x}
                                cy={y}
                                r={radius}
                                fill="white"
                                stroke="#333"
                                strokeWidth="2"
                            />
                        );

                        return [...lines, circle];
                    })
                ))}
            </svg>
        </Block>
    );
};

export default NetworkVisualization;
