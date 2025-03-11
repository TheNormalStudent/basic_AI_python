import Block from "../Block/Block";
import { LineChart } from '@mui/x-charts';
import { useEpochGraphCoords } from "../../hooks/useEpochGraphCoords";
import { useEpochPercGraphCoords } from "../../hooks/useEpochGraphPercCoords";
import { useEffect, useState } from "react";

export default function EpochGraph({clearEpochGraphsFuncRef})
{
    const {xData, yData, clear} = useEpochGraphCoords();
    const {xDataPerc, yDataPerc, clearPerc} = useEpochPercGraphCoords();

    useEffect(() => {
        clearEpochGraphsFuncRef.current = () => {
            clear();
            clearPerc();
        }
        
        return(() => {
            clearEpochGraphsFuncRef.current = null;
        });
    }, []);

    return(<>
        <Block blockName={"Epoch Graph"} >
            <div style={{height: "100%", display: "flex", paddingLeft: "1%"}}>
                <div style={{height: "100%", width: "50%"}}>          
                    <LineChart
                    xAxis={[{ data: xData, label: "Epoch" }]}
                    series={[
                        {
                        data: yData, showMark: false, label: "Cost"
                        },
                    ]}
                    />
                </div>

                <div style={{height: "100%", width: "50%"}}>          
                    <LineChart
                    xAxis={[{ data: xDataPerc, label: "Epoch" }]}
                    series={[
                        {
                        data: yDataPerc, showMark: false, label: "Success Percentage"
                        },
                    ]}
                    />
                </div>
            </div>
        </Block>
    </>);
}   