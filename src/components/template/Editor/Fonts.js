import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Button } from '@mui/material';
import { TemplateConext } from '../../../context/CreateTemplateContext';

const fsize = [12, 14, 16, 18, 20, 24, 26, 30, 32, 36, 40, 42, 48,50,54,60];
const category = ["Hackathon", "Metaverse", "Degree"];
const fbold = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const fontList =['Roboto',
'Borsok', 'Open Sans',
'Lato ', 'Poppins', 'Zeyada',
'Babylonica', 'Dancing Script',
'Lobster', 'Pacifico', 'Caveat',
'Satisfy', 'Great Vibes', 'Ole', 'Coiny', 'Kenia', 'Rubik Beastly', 'Londrina Sketch', 'Neonderthaw',
'Kumar One','Ribeye', 'Emblema One', 'Ewert', 'Kavoon', 'Moul', 'Rubik Moonrocks', 'Rubik Iso',
'Unifraktur Cook', 'Germania One', 'Monoton', 'Orbitron', 'Rampart One','Black Ops One',
'Aldrich','Schoolbell','UnifrakturMaguntia','Montez','DotGothic16','Lexend Zetta','UnifrakturCook',
'Iceland',
];
const SelectFonts = () => {
    const templateConext = React.useContext(TemplateConext);
    const { selectedFont,
        handleFontChange,
        fontSize,
        handleSizeChange,
        bold,
        handleBoldChange,
        certCategory,
        handleDeleteElements,
        handleChangeCategory, 
    } = templateConext;
    
    return (
        <Stack sx={{ my: 2 }} direction="row">
            <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Font</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedFont}
                        label="Select Font"
                        onChange={handleFontChange}
                    > 
                        {
                            fontList.map((e) => {
                                return <MenuItem style={{fontFamily: e}} value={e}>{e}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Font Size</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={fontSize}
                        label="Select Font"
                        onChange={handleSizeChange}
                    >

                        {
                            fsize.map((e) => {
                                return <MenuItem value={e}>{e}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Font weight</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={bold}
                        label="Font weight" 
                        onChange={handleBoldChange}
                    >

                        {
                            fbold.map((e) => {
                                return <MenuItem value={e}>{e}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={certCategory}
                        label="Select Font"
                        onChange={handleChangeCategory}
                    >
                        {
                            category.map((e) => {
                                return <MenuItem value={e}>{e}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </Box> 
        </Stack>
    );
};

export default SelectFonts;