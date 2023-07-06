import React from 'react';
import { Button, ButtonGroup } from '@mui/material'; 
import { TemplateConext } from '../../../context/CreateTemplateContext';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Upload = () => {
    const templateConext = React.useContext(TemplateConext);
    const {
        changeBgImage,
        changeLogo,
        changeSign,
        handleDeleteBg,
        handleDeleteLogo,
        handleDeleteSign,
        uploadBg,
        uploadLogo,
        uploadSign,
    } = templateConext;
    return (
        <div>
            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
            >
                <Button className="thm-btn header__cta-btn m-2" sx={{ m: 1 }} variant="contained" component="label" >
                    <span> Background Image</span>
                    <input onChange={(e) => changeBgImage(e)} hidden accept="image/*" multiple type="file" />

                </Button>
                {
                    uploadBg && <IconButton aria-label="delete bg Image" onClick={handleDeleteBg}>
                        <DeleteIcon />
                    </IconButton>
                }
            </ButtonGroup>

            <Button className="thm-btn header__cta-btn m-2" sx={{ m: 1 }} variant="contained" component="label" >
                <span>Logo</span>
                <input onChange={(e) => changeLogo(e)} hidden accept="image/*" multiple type="file" />

            </Button>
            {
                uploadLogo && <IconButton aria-label="delete logo" onClick={handleDeleteLogo}>
                    <DeleteIcon />
                </IconButton>
            }
            <Button className="thm-btn header__cta-btn m-2" sx={{ m: 1 }} variant="contained" component="label" >
                <span>Upload Signature</span>
                <input onChange={(e) => changeSign(e)} hidden accept="image/*" multiple type="file" />

            </Button>
            {
                uploadSign && <IconButton aria-label="delete sign" onClick={handleDeleteSign}>
                    <DeleteIcon />
                </IconButton>
            }
        </div>
    );
};

export default Upload;