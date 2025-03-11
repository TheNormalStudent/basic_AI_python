import Block from "../Block/Block";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography } from '@mui/material';
import { useState, useCallback, useRef } from "react";
import { checkAndSetFloat, checkAndSetInt, parseNumberList } from "../../utils/checkAndSetNumbers";
import { trainApi } from "../../api/backend_api";

export default function ModelSettings({ DataSettingsConnector, updateModelArch, setFromClear, setIsTraining, isTraining, clearEpochGraphsFuncRef })
{
    const [currentAlpha, setCurrentAlpha] = useState(null);
    const [currentLayers, setCurrentLayers] = useState([0]);
    const [currentEpochs, setCurrentEpochs] = useState(null);

    
    const handleAlphaChange = useCallback((e) => checkAndSetFloat(e.target.value, setCurrentAlpha), []);
    const handleEpochsChange = useCallback((e) => checkAndSetInt(e.target.value, setCurrentEpochs), []);

    const handleLayersChange = useCallback((e) => {
        try {
            setCurrentLayers(parseNumberList(e.target.value));
        } catch {
            setCurrentLayers(null);
        }
    }, []);
    

    const handleTrainClick = useCallback(async () => {
        if (isTraining) {
            try {
                await trainApi.abort();
                setIsTraining(false);
            } catch (error) {
                console.error("Error aborting training:", error);
            }
            return;
        }

        let validationError = false;

        if (currentAlpha === null || isNaN(currentAlpha)) { setCurrentAlpha(NaN); validationError = true; }
        if (currentEpochs === null || isNaN(currentEpochs)) { setCurrentEpochs(NaN); validationError = true; }
        if (!currentLayers || JSON.stringify(currentLayers) === JSON.stringify([0])) { setCurrentLayers(null); validationError = true; }
        if (isNaN(DataSettingsConnector['testSet'])) { validationError = true; }
        if (isNaN(DataSettingsConnector['trainSet'])) { validationError = true; }
        if (!DataSettingsConnector['dataImported']) { validationError = true; }

        DataSettingsConnector.highlightValidationErrors();
        if (validationError) return;

        clearEpochGraphsFuncRef.current();
        
        try {
            const response = await trainApi.train({
                alpha: currentAlpha,
                layers: currentLayers,
                epochs: currentEpochs,
                train_set_percentage: DataSettingsConnector['trainSet'],
                test_set_percentage: DataSettingsConnector['testSet']
            });
            updateModelArch(response.data);
            setIsTraining(true);
        } catch (error) {
            console.error("Error during training:", error);
        }
    }, [currentAlpha, currentLayers, currentEpochs, isTraining, DataSettingsConnector, updateModelArch, setFromClear, setIsTraining]);

    return(<>
        <Block blockName={"Model Settings"}>
        <Grid container spacing={3}>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Alpha:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={isNaN(currentAlpha)} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (handleAlphaChange(e))} placeholder="0.001" variant="outlined"
                slotProps={{ inputLabel: {shrink: true} }} 
                label="Required"></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Layers:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={currentLayers === null} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (handleLayersChange(e))} placeholder="1, 2, 3, 4, 5" variant="outlined" 
                slotProps={{ inputLabel: {shrink: true} }} 
                label="Required"></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 5}} align="right">Epochs:</Typography>
            </Grid>
            <Grid size={7}>
                <TextField required error={isNaN(currentEpochs)} sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                onChange={(e) => (handleEpochsChange(e))} placeholder="1000" variant="outlined" 
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
                <Button onClick={() => handleTrainClick()} variant="outlined" size="large">{(isTraining ? "ABORT" : "TRAIN")}</Button>
            </Grid>
        </Grid>
        </Block>
    </>);
}