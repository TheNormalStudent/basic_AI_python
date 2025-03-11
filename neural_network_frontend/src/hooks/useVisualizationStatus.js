import { useState, useEffect } from 'react';
import { apiInstance } from '../api/backend_api';
import { visualization_status } from '../consts/default';

export const useVisulizationStatus = () =>
{
    const [status, setStatus] = useState(visualization_status.NOT_KNOWN)
    const [activeLayerIndex, setActiveLayerIndex] = useState(null)

    useEffect(() => {
        const eventSource = new EventSource(apiInstance.defaults.baseURL + "/model/visualization-update-stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setActiveLayerIndex(data.activeLayer);
            setStatus(data.status);
        };

        eventSource.onerror = (e) =>{
            console.log(e);
        }
    
        return () => {
          eventSource.close(); 
        };
    }, []);

    return {status: status, activeLayerIndex: activeLayerIndex};
}