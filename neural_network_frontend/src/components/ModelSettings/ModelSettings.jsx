import Block from "../Block/Block";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from "react";
import { checkAndSetFloat, checkAndSetInt, parseNumberList } from "../../utils/checkAndSetNumbers";
import { trainApi } from "../../api/backend_api";

export default function ModelSettings({ DataSettingsConnector })
{
    const [currentAlpha, setCurrentAlpha] = useState(null);
    const [currentLayers, setCurrentLayers] = useState([0]);
    const [currentEpochs, setCurrentEpochs] = useState(null);

    const checkAndSetAlpha = (e) => checkAndSetFloat(e.target.value, setCurrentAlpha);

    const checkAndSetLayers = (e) =>
    {
       try{
            const arr = parseNumberList(e.target.value);
            setCurrentLayers(arr);
        }
        catch
        { setCurrentLayers(null); }
    }

    const checkAndSetEpochs = (e) => checkAndSetInt(e.target.value, setCurrentEpochs);

    async function onTrainClick()
    {
        let to_ret = false;
        if(currentAlpha === null || isNaN(currentAlpha)) {setCurrentAlpha(NaN); to_ret = true;}
        if(currentEpochs === null || isNaN(currentEpochs)) {setCurrentEpochs(NaN); to_ret = true;}
        if(currentLayers === null || JSON.stringify(currentLayers) === JSON.stringify([0])){setCurrentLayers(null); to_ret = true;}
        if(DataSettingsConnector['testSet'] === null || isNaN(DataSettingsConnector['testSet'])){to_ret = true;}
        if(DataSettingsConnector['trainSet'] === null || isNaN(DataSettingsConnector['trainSet'])){to_ret = true;}
        if(!DataSettingsConnector['dataImported']) {to_ret = true;}

        DataSettingsConnector['highlightValidationErrors']();
        if(to_ret) return;

        trainApi.train({
            alpha: currentAlpha, 
            layers: currentLayers, 
            epochs: currentEpochs, 
            train_set_percentage: DataSettingsConnector['trainSet'], 
            test_set_percentage: DataSettingsConnector['testSet']
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });

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