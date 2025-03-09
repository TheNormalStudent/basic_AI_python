import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useRef, useState, useEffect } from 'react';

export default function EpochGraph({xData, yData})
{
    return(<>
        <Block blockName={"Epoch Graph"} >
            <div style={{height: "100%"}}>          
                <LineChart
                xAxis={[{ data: xData }]}
                series={[
                    {
                    data: yData, showMark: false
                    },
                ]}
                />
                
            </div>
        </Block>
    </>);
}   