import { Row, Col, Container } from 'react-bootstrap';
import { useEffect, useState, useCallback } from 'react';
import GPSTrackingWithButton from './GPSTrackingWithButton';
import VisualizationCard from './VisualizationCard';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CameraRecording from './CameraRecoding';

const SERVER = 'https://fwo91hdzog.execute-api.us-east-1.amazonaws.com/test/dynamodbmanager';

function SimulationAnalysisPage() {
    const [input, setInput] = useState('');
    const [simulationId, setSimulationId] = useState('');
    const [showGraphs, setShowGraphs] = useState(false);
    const [response, setResponse] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [allSimIds, setAllSimIds] = useState([]);
    const [compareResponse, setCompareResponse] = useState(null);
    const [compareId, setCompareId] = useState('');

    const postFetchRequest = useCallback((payload) => {
        return fetch(SERVER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json());
    }, []);

    const fetchAllSimIds = useCallback(() => {
        const data = {
            "operation": "search_ids"
        };
    
        postFetchRequest(data)
        .then(data => {
            setAllSimIds(data?.IDs || []);
        })
        .catch((error) => {});
    }, [postFetchRequest]);

    const fetchData = useCallback(() => {
        const payload = {
            "operation": "get_simulation",
            "payload": {
                "SimulationId": simulationId,
                "anomalyDetection": 1
            }
        };
    
        postFetchRequest(payload)
        .then(data => {
            setResponse(data);
            if (data === undefined) {
                setNotFound(true);
                setShowGraphs(false);
            } else {
                setShowGraphs(true);
            }
        })
        .catch((error) => {});
    }, [simulationId, postFetchRequest]);

    const fetchCompareData = useCallback(() => {
        const payload = {
            "operation": "get_simulation",
            "payload": {
                "SimulationId": compareId,
                "anomalyDetection": 1
            }
        };
    
        postFetchRequest(payload)
        .then(data => {
            setCompareResponse(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [compareId, postFetchRequest]);

    useEffect(() => {
        if (simulationId !== '') {
            fetchData();
        }
    }, [simulationId, fetchData]);

    useEffect(() => {
        if (compareId !== '') {
            fetchCompareData();
        }
    }, [compareId, fetchCompareData]);

    useEffect(() => {
        if (response !== null) {
            if (response === undefined) {
                setNotFound(true);
            }
        }
    }, [response]);

    useEffect(() => {
        fetchAllSimIds();
    }, [fetchAllSimIds]);

    const handleSearch = () => {
        setNotFound(false);
        setShowGraphs(false);
        setSimulationId(input);
    }

    const handleCompareSearch = () => {
        setCompareId(input);
    }

    return (
        <Container>
            <Col>
                <Row style={{width: '80vw', display: 'flex'}}>
                    <Autocomplete
                        disableClearable
                        options={allSimIds}
                        renderInput={(params) => (
                            <TextField
                                variant="standard"
                                {...params}
                                label="Simulation ID"
                                placeholder='Enter Simulation ID'
                                style={{width: '60vw'}}
                                InputProps={{
                                ...params.InputProps,
                                type: 'search',
                                }}
                            />
                        )}
                        onChange={(e, value) => setInput(value)}
                    />
                    <Button 
                        style={{marginLeft: '3vw', width: '10vw', height: '3vh', marginTop: '3vh'}}
                        onClick={handleSearch}
                    >
                        <SearchIcon />
                        <text style={{marginLeft: '0.5vw', fontSize: '1vw'}}>Look up</text>
                    </Button>
                </Row>
                {notFound && (
                    <Row style={{marginTop: '1vh', width: '60vw'}}>
                        <Alert severity="error">Simulation not found, try different simulation Id!</Alert>
                    </Row>
                )}
                {!notFound && showGraphs && (
                    <Container>
                        <Row style={{width: '76vw', display: 'flex'}}>
                            <Card style={{width: '45vw', marginTop: '4vh', height: '64vh', borderRadius: '10px', marginRight: '1vw'}}>
                                <CameraRecording/>
                            </Card>

                            <Card style={{width: '30vw', marginTop: '4vh', height: '64vh', borderRadius: '10px'}}>
                                <Row style={{width: '30vw'}}>
                                    <GPSTrackingWithButton data={response} />
                                </Row>
                            </Card>
                        </Row>

                        <Card style={{width: '76vw', marginTop: '3vh', height: '50vh', borderRadius: '10px'}}>
                            <Row style={{width: '85vw', display: 'flex', marginTop: '2.5vh'}}>
                                <Typography variant="button" style={{marginLeft: '1.5vw', fontSize: '1.2vw', color: '#1870d5'}}>
                                    {"Current Test: " + simulationId}
                                </Typography>
                            </Row>
                            <VisualizationCard data={response} notFound={notFound}/>
                        </Card>

                        
                        <Card style={{width: '76vw', marginTop: '3vh', height: '50vh', borderRadius: '10px'}}>
                            <Row style={{width: '85vw', display: 'flex', marginTop: '2.5vh'}}>
                                <Typography variant="button" style={{marginLeft: '1.5vw', fontSize: '1.2vw', color: '#1870d5'}}>
                                    Compare To Test: 
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={allSimIds}
                                    sx={{ width: 300, marginLeft: '1vw' }}
                                    renderInput={(params) => <TextField {...params} variant="standard"/>}
                                    onChange={(e, value) => {
                                        setCompareId(value || '');
                                        setCompareResponse(null);
                                    }}
                                />
                            </Row>
                            {compareResponse !== null ? (
                                <VisualizationCard data={compareResponse} notFound={notFound} />
                            ) : (
                                <VisualizationCard data={response} notFound={notFound} />
                            )}
                        </Card>
                    </Container>
                )}
            </Col>
        </Container>
    );
}

export default SimulationAnalysisPage;
