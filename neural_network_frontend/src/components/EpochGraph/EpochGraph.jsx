import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useRef, useState, useEffect } from 'react';

export default function EpochGraph()
{
    return(<>
        <Block blockName={"Epoch Graph"} >
            <div style={{height: "100%"}}>          
                <LineChart
                xAxis={[{ data: [...Array(1000).keys()] }]}
                series={[
                    {
                    data: [...Array(1000).keys()], showMark: false
                    },
                ]}
                />
                
            </div>
        </Block>
    </>);
}   