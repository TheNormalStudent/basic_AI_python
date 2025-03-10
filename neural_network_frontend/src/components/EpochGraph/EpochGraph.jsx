import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useRef, useState, useEffect } from 'react';
import { useEpochGraphCoords } from "../../hooks/useEpochGraphCoords";

export default function EpochGraph({fromClear, setFromClear})
{
    const {xData, yData} = useEpochGraphCoords(fromClear, setFromClear);
    
    return(<>
        <Block blockName={"Epoch Graph"} >
            <div style={{height: "100%"}}>          
                <LineChart
                xAxis={[{ data: xData, label: "Epoch" }]}
                series={[
                    {
                    data: yData, showMark: false, label: "Cost"
                    },
                ]}
                />
                
            </div>
        </Block>
    </>);
}   