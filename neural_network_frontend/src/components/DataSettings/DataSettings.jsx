import Block from "../Block/Block";
import Grid from '@mui/material/Grid2';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from "react";
import {checkAndSetFloat} from "../../utils/checkAndSetNumbers";
import { uploadFile } from "../../api/backend_api";

export default function DataSettings({ UpdateDataSettingsContext })
{
    const [currentTrainSet, setCurrentTrainSet] = useState(null);
    const [currentTestSet, setCurrentTestSet] = useState(null);
    const [currentValidationSet, setCurrentValidationSet] = useState(null);
    const [file, setFile] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        UpdateDataSettingsContext('highlightValidationErrors', () => {
            if(currentTrainSet == null) setCurrentTrainSet(NaN);
            if(currentTestSet == null) setCurrentTestSet(NaN);
        }) 
    }, [currentTrainSet, currentTestSet]);

    const handleInputClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = () => {
        setFile(inputRef.current.files[0]);

        uploadFile.uploadfile({file: inputRef.current.files[0]})
        .then((response) => {
            UpdateDataSettingsContext('dataImported', true);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return(<>
        <Block blockName={"Data Settings"}>
        <Grid container spacing={4} rowSpacing={2}>
            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Train: </Typography>
            </Grid>
            <Grid size={7}>
                <PercentTextField error_set={currentTrainSet} updateFunc={(value) => UpdateDataSettingsContext('trainSet', value)} setSet={setCurrentTrainSet} />
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Test: </Typography>
            </Grid>
            <Grid size={7}>
                <PercentTextField error_set={currentTestSet} updateFunc={(value) => UpdateDataSettingsContext('testSet', value)} setSet={setCurrentTestSet} />
            </Grid>

            <Grid size={5}>
                <Typography variant="h5" style={{ marginTop: 9}} align="right">Validate: </Typography>
            </Grid>
            <Grid size={7}>
                <PercentTextField error_set={currentValidationSet} updateFunc={(value) => UpdateDataSettingsContext('validateSet', value)} setSet={setCurrentValidationSet} />
            </Grid>

            <Grid size={12} textAlign={"center"} >
                <Button variant="outlined" size="large" sx={{borderColor: (file ? "green" : "red")}} onClick={() => handleInputClick()}>Import Data</Button>
            </Grid>

            <input ref = {inputRef} style={{display: "none"}} type="file" onChange={() => handleFileChange()}/>
        </Grid>
        </Block>
    </>);
}

function PercentTextField({error_set, updateFunc, setSet})
{
    return (          
    <TextField 
    error={isNaN(error_set)}
    sx={{'.MuiInputBase-input': { fontSize: '1rem' }, }} 
    placeholder="10" variant="outlined" 
    slotProps={{ input: {endAdornment: <InputAdornment position="end">%</InputAdornment>}}} 
    onChange={(e) => {checkAndSetFloat(e.target.value, setSet); updateFunc(e.target.value) }}
    />)
}