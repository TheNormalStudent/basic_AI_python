import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useRef, useState, useEffect } from 'react';

export default function EpochGraph()
{
    const blockRef = useRef(null)
 // TO DO the weight and height of a chart should be adjustable
    return(<>
        <Block blockName={"Epoch Graph"} blockRef={blockRef}>
            <div>          
            <div onClick={() => console.log(blockRef)}><h1>hello</h1></div>  
                <LineChart
                xAxis={[{ data: [...Array(1000).keys()] }]}
                series={[
                    {
                    data: [...Array(1000).keys()], showMark: false
                    },
                ]}
                width={500}
                height={300}
                />
                
            </div>

        </Block>
    </>);
}   