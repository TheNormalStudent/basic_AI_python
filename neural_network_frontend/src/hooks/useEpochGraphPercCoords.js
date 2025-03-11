import { useState, useEffect } from 'react';
import { apiInstance } from '../api/backend_api';

export const useEpochPercGraphCoords = () =>
{
    const [xData, setXData] = useState([])
    const [yData, setYData] = useState([])

    useEffect(() => {
        const eventSource = new EventSource(apiInstance.defaults.baseURL + "/model/epoch-graph-perc-update-stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            setXData((prev) => [...prev, data.epochNum]);
            setYData((prev) => [...prev, data.correct / data.total * 100]);
        };

        eventSource.onerror = (e) =>{
            console.log(e);
        }
    
        return () => {
          eventSource.close(); 
        };
    }, []);

    const clear = () => {
        setXData([]);
        setYData([]);
    };

    return {xDataPerc: xData, yDataPerc: yData, clearPerc: clear};
}