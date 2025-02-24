import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Brightness4, Brightness7, Mode } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EpochGraph, NetworkVisualization, ModelSettings, DataSettings}  from './index';
import Block from './components/Block/Block';
import GitHubIcon from '@mui/icons-material/GitHub';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [DataSettingsControl, setDataSettingsControl] = useState({
    'dataImported': false,
    'testSet': null, 
    'trainSet': null,
    'validateSet': null,
    'highlightValidationErrors': null
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  function updateSetDataSettingsControl(settingName, newValue)
  {
  
    let newDataSetControl = {...DataSettingsControl}
    newDataSetControl[settingName] = newValue;
    setDataSettingsControl(newDataSetControl);
    console.log("i was tried to have been updated", newDataSetControl)
  }

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Neural Network Infographics</Typography>
          <IconButton onClick={() => window.open('https://github.com/TheNormalStudent/basic_AI_python') }>
            <GitHubIcon color="inherit" fontSize='large'/>
          </IconButton>
          <IconButton color="inherit" onClick={toggleTheme}>
            {darkMode ? <Brightness7 fontSize='large'/> : <Brightness4 fontSize='large'/>}
          </IconButton>
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} rowSpacing={3} padding={2}>
        <Grid size={6}>
            <DataSettings UpdateDataSettingsContext={updateSetDataSettingsControl}></DataSettings>
        </Grid>
        <Grid size={6}>
          <NetworkVisualization layers={[30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 1]}></NetworkVisualization>
        </Grid>
        <Grid size={6}>
          <ModelSettings DataSettingsConnector={DataSettingsControl}></ModelSettings>
        </Grid>
        <Grid size={6}>
          <EpochGraph></EpochGraph>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
