import Block from "../Block/Block";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from "react";
import { checkAndSetFloat, checkAndSetInt } from "../../utils/checkAndSetNumbers";

export default function ModelSettings({ DataSettingsConnector })
{
    const re_layers = /^\d+(,\s*\d+)*$/;
    const [currentAlpha, setCurrentAlpha] = useState(null);
    const [currentLayers, setCurrentLayers] = useState([0]);
    const [currentEpochs, setCurrentEpochs] = useState(null);

    function checkAndSetAlpha(e)
    {
        checkAndSetFloat(e.target.value, setCurrentAlpha);
    }

    function checkAndSetLayers(e)
    {
        function parseNumberList(input) {
        
            if (!re_layers.test(input)) {
                throw new Error("Invalid input format");
            }
        
            return input.split(",").map(num => parseInt(num.trim(), 10));
        }

        const layer_string = e.target.value;
        
        try{
            const arr = parseNumberList(layer_string);
            console.log(arr);
            setCurrentLayers(arr);
        }
        catch
        {
            setCurrentLayers(null);
        }
    }

    function checkAndSetEpochs(e)
    {
        checkAndSetInt(e.target.value, setCurrentEpochs);
    }

    function onTrainClick()
    {
        let to_ret = false;
        if(currentAlpha === null || isNaN(currentAlpha)) {setCurrentAlpha(NaN); to_ret = true;}
        if(currentEpochs === null || isNaN(currentEpochs)) {setCurrentEpochs(NaN); to_ret = true;}
        if(currentLayers === null || JSON.stringify(currentLayers) === JSON.stringify([0])){setCurrentLayers(null); to_ret = true;}
        if(DataSettingsConnector['testSet'] === null || isNaN(DataSettingsConnector['testSet'])){to_ret = true;}
        if(DataSettingsConnector['trainSet'] === null || isNaN(DataSettingsConnector['trainSet'])){to_ret = true;}

        DataSettingsConnector['highlightValidationErrors']();
        if(to_ret) return;

        

        alert(`Train is ongoing now with theese parameters. \nAlpha: ${currentAlpha}. 
            \nLayers: ${currentLayers}
            \nEpochs: ${currentEpochs}
            \nTestSet: ${DataSettingsConnector['testSet']}
            \nTrainSet: ${DataSettingsConnector['trainSet']}
            \nValidateSet: ${DataSettingsConnector['validateSet']}

            `)
    }

    return(<>
        <Block blockName={"Model Settings"}>
        <Grid container spacing={3}>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Alpha:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={isNaN(currentAlpha)} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (checkAndSetAlpha(e))} placeholder="0.001" variant="outlined"
                slotProps={{ inputLabel: {shrink: true} }} 
                label="Required"></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Layers:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={currentLayers === null} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (checkAndSetLayers(e))} placeholder="1, 2, 3, 4, 5" variant="outlined" 
                slotProps={{ inputLabel: {shrink: true} }} 
                label="Required"></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Epochs:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={isNaN(currentEpochs)} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (checkAndSetEpochs(e))} placeholder="1000" variant="outlined" 
                slotProps={{ inputLabel: {shrink: true} }} 
                label="Required"></TextField>
            </Grid>

            <Grid size={4} textAlign={"center"} >
                <Button variant="outlined" size="large">Import Network</Button>
            </Grid>
            <Grid size={4} textAlign={"center"}>
                <Button variant="outlined" size="large">Export Network</Button>
            </Grid>
            <Grid size={4} textAlign={"center"} >
                <Button onClick={() => onTrainClick()} variant="outlined" size="large">TRAIN</Button>
            </Grid>
        </Grid>
        </Block>
    </>);
}