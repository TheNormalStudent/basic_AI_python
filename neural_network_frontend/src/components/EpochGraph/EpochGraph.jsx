import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useRef, useState, useEffect } from 'react';
import { apiInstance } from "../../api/backend_api";

export default function EpochGraph({})
{
    const [xData, setXData] = useState([])
    const [yData, setYData] = useState([])
    
    useEffect(() => {
        const eventSource = new EventSource(apiInstance.defaults.baseURL + "/model/epoch-graph-update-stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setXData((prev) => [...prev, data.epochNum]);
            setYData((prev) => [...prev, data.cost]);
        };

        eventSource.onerror = (e) =>{
            console.log(e);

        }
        
    
        return () => {
          eventSource.close(); 
        };
    });

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