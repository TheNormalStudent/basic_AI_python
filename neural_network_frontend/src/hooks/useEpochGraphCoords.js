import { useRef, useState, useEffect } from 'react';
import { apiInstance } from '../api/backend_api';

export const useEpochGraphCoords = (fromClear, setFromClear) =>
{
    const [xData, setXData] = useState([])
    const [yData, setYData] = useState([])

    useEffect(() => {
        const eventSource = new EventSource(apiInstance.defaults.baseURL + "/model/epoch-graph-update-stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if(fromClear)
            {
                setFromClear(false);
                setXData([data.epochNum]);
                setYData([data.cost]);
                
            }
            else
            {
                setXData((prev) => [...prev, data.epochNum]);
                setYData((prev) => [...prev, data.cost]);
            }
        };

        eventSource.onerror = (e) =>{
            console.log(e);
        }
    
        return () => {
          eventSource.close(); 
        };
    }, [fromClear]);

    return {xData: xData, yData: yData};
}