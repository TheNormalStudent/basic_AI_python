import Block from '../Block/Block';
import {useState, useRef, useEffect} from 'react'
import { visualization_status } from '../../consts/default';
import { useVisulizationStatus } from '../../hooks/useVisualizationStatus';

function NetworkVisualization({ layers, children }){
    const max_good_drawn_layers = 10;
    const svgRef = useRef(null);
    const [svgSize, setSvgSize] = useState({width: 0, height: 0})
    const {status, activeLayerIndex} = useVisulizationStatus();

    useEffect(() => {
        if(svgRef.current)
            {
                setSvgSize({width: svgRef.current.clientWidth, height: svgRef.current.clientHeight})
            }
    }, []);

    const calculateY = (radius, svgHeight, neurons_count, index) => {
        const maxLayers = Math.max.apply(null, layers)

        if(neurons_count == 1) return svgHeight/2;
        if(neurons_count == maxLayers && radius * neurons_count * 2 >= svgHeight) return radius + index * radius * 2

        let totalSpaceLeft = (svgHeight - radius * neurons_count * 2);
        let spread = 0.6;
        let betweenSpacing = (totalSpaceLeft * spread) / (neurons_count-1);
        let side_spacing = (totalSpaceLeft - betweenSpacing * (neurons_count-1))/2;
        return side_spacing + radius + (radius * 2 + betweenSpacing) * index ;
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
        <Block blockName={`Network Visualization (${status})`} >
            <svg width="100%" height="100%" ref={svgRef} >
                {svgSize.width > 0 && layers.map((neurons, layerIdx) => (
                    Array.from({ length: neurons }).map((_, neuronIdx) => {
                        const radius = calculateRadius(svgSize.height, svgSize.width)
                        if(layerIdx === 0) var x = radius;
                        else var x = calculateX(radius, svgSize.width, layers.length, layerIdx);
                        const y = calculateY(radius, svgSize.height, neurons, neuronIdx);
                        
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

                        var fill = "white"
                        console.log(status, activeLayerIndex)
                        
                        if(layerIdx === activeLayerIndex)
                        {
                            switch(status)
                            {
                                case visualization_status.FEED_FORWARD:
                                {
                                    fill = "#3dfcff"
                                    break;
                                }
                                case visualization_status.BACKPROP:
                                {
                                    fill = "#ff4f3d"
                                    break;
                                }
                            }
                        }

                            
                        // Draw neuron circle
                        const circle = (
                            <circle
                                key={`neuron-${layerIdx}-${neuronIdx}`}
                                cx={x}
                                cy={y}
                                r={radius}
                                fill={fill}
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
