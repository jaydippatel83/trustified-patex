import React from 'react'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material'

function CreateTemplate() {
  const navigate = useNavigate();

  const handleClickNavigate = () => {
    navigate("/dashboard/certificate");
  }

  return (
    <div className='footer-position '>
      <Paper elevation={1} sx={{ p: 2 }}>
        <div className="container  mt-5 mb-5">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <a className="thm-btn header__cta-btn" onClick={handleClickNavigate} >
                  <span>Create NFT</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default CreateTemplate;