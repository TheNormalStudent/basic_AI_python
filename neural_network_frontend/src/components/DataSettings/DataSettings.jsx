import Block from "../Block/Block";
import Grid from '@mui/material/Grid2';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import {checkAndSetFloat} from "../../utils/checkAndSetNumbers";

export default function DataSettings({ UpdateDataSettingsContext })
{
    const [currentTrainSet, setCurrentTrainSet] = useState(null);
    const [currentTestSet, setCurrentTestSet] = useState(null);
    const [currentValidationSet, setCurrentValidationSet] = useState(null);

    useEffect(() => {
        console.log("Rendered datasettins");
        UpdateDataSettingsContext('highlightValidationErrors', () => {
            if(currentTrainSet == null) setCurrentTrainSet(NaN);
            if(currentTestSet == null) setCurrentTestSet(NaN);
        }) 
    }, [currentTrainSet, currentTestSet]);


    return(<>
        <Block blockName={"Data Settings"}>
        <Grid container spacing={4} rowSpacing={2}>
            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Train: </Typography>
            </Grid>
            <Grid size={7}>
                <TextField required 
                error={isNaN(currentTrainSet)}
                sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                placeholder="80" variant="outlined" 
                slotProps={{ input: {endAdornment: <InputAdornment position="end">%</InputAdornment>}, inputLabel: {shrink: true} }} 
                label="Required" onChange={(e) => {checkAndSetFloat(e.target.value, setCurrentTrainSet); UpdateDataSettingsContext('trainSet', 
                    parseFloat(e.target.value))}}
                ></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Test: </Typography>
            </Grid>
            <Grid size={7}>
                <TextField  
                error={isNaN(currentTestSet)}
                required sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                placeholder="10" variant="outlined" 
                slotProps={{ input: {endAdornment: <InputAdornment position="end">%</InputAdornment>}, inputLabel: {shrink: true} }} 
                label="Required" onChange={(e) => {checkAndSetFloat(e.target.value, setCurrentTestSet); UpdateDataSettingsContext('testSet', 
                    parseFloat(e.target.value))}}
                ></TextField>
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Validate: </Typography>
            </Grid>
            <Grid size={7}>
                <TextField 
                error={isNaN(currentValidationSet)}
                sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
                placeholder="10" variant="outlined" 
                slotProps={{ input: {endAdornment: <InputAdornment position="end">%</InputAdornment>}}} 
                onChange={(e) => {checkAndSetFloat(e.target.value, setCurrentValidationSet); UpdateDataSettingsContext('validateSet', 
                    parseFloat(e.target.value))}}
                ></TextField>
            </Grid>

            <Grid size={12} textAlign={"center"} >
                <Button variant="outlined" size="large">Import Data</Button>
            </Grid>
        </Grid>
        </Block>
    </>);
}