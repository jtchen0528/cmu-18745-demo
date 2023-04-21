import React from 'react';
import { Row } from 'react-bootstrap';
import Typography from '@mui/material/Typography';

function CameraRecording() {

  return (
    <div>
        <Row style={{width: '85vw', display: 'flex', marginTop: '2.5vh'}}>
            <Typography variant="button" style={{marginLeft: '1.5vw', fontSize: '1.2vw', color: '#1870d5'}}>
                Camera Recording
            </Typography>
        </Row>
        <Row>
            <iframe 
                src="https://www.youtube.com/embed/KLOceDeegVs" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        </Row>
    </div>
  )
}

export default CameraRecording;