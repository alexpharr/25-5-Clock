import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

/* Helper Functions */

const pad = (x) => (x < 10) ? '0' + x.toString() : x.toString();

const formatTime = (s) => {
  const mins = Math.trunc(s / 60);
  const secs = s % 60;
  return pad(mins) + ":" + pad(secs);
}

/* React */

const SettingsInput = (props) => {
  return (
    <>
      <Button variant="outline-dark" style={{ fontSize: '0.8rem' }} id={props.id + "-increment"} onClick={props.onClick} className="bi bi-arrow-up m-2" />
      <span id={props.id + "-length"}>{props.length}</span>
      <Button variant="outline-dark" style={{ fontSize: '0.8rem' }} id={props.id + "-decrement"} onClick={props.onClick} className="bi bi-arrow-down m-2" />
    </>
  );
}

const SessionCard = (props) => {
  const playOrPause = () => {
    return props.timerActive ? (<i className="bi bi-pause-fill p-2" />) : (<i className="bi bi-play-fill p-2" />);
  }

  return (
    <Card className="mx-auto" style={{ width: '70%', margin: '2em', padding: '1em' }}>
      <Card.Title id="timer-label">{props.breakActive ? "Break" : "Session"}</Card.Title>
      <Card.Text id="time-left">{props.timeLeft}</Card.Text>
      <Card.Footer>
        <ButtonGroup>
          <Button variant="outline-dark" id="start_stop" onClick={props.onStopStart}>{playOrPause()}</Button>
          <Button variant="outline-dark" id="reset" onClick={props.onReset}><i className="bi bi-arrow-clockwise p-2" /></Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}

const App = () => {
  const [counters, setCounters] = useState({ break: 5, session: 25 })
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);
  const [breakActive, setBreakActive] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      let audio = document.getElementById("beep");
      audio.play();
      breakActive ? setTimeLeft(counters.session * 60) : setTimeLeft(counters.break * 60);
      setBreakActive(!breakActive);
    }

    if (timerActive) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeLeft, breakActive]);

  const handleReset = () => {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    setCounters({ break: 5, session: 25 })
    setTimeLeft(1500);
    setTimerActive(false);
    setBreakActive(false); 
  }

  const handleCounter = (e, key) => {
    let obj = {...counters};
    if (e.target.id.includes("increment")) {
      obj[key] += 1;
    } else if (e.target.id.includes("decrement")) {
      obj[key] -= 1;
    }

    if (Object.values(obj).some(x => (x <= 0 || x > 60))) {
      return;
    } else {
      setCounters(obj);
      setTimeLeft(obj.session * 60);
    }
  }

  return (
    <Container className="m-3 mx-auto">
      <Card className="text-center w-50 mx-auto" border="dark">
        <Card.Body>
          <Card.Header className="mb-4">25 + 5 Clock</Card.Header>
          <Card.Subtitle>
            <Row>
              <Col id="break-label">Break Length</Col>
              <Col id="session-label">Session Length</Col>
            </Row>
            <Row className="p-2">
              <Col><SettingsInput id="break" length={counters.break} onClick={(e) => handleCounter(e, "break")} /></Col>
              <Col><SettingsInput id="session" length={counters.session} onClick={(e) => handleCounter(e, "session")} /></Col>
            </Row>
            <Row>
              <SessionCard 
              timeLeft={formatTime(timeLeft)} 
              onReset={() => handleReset()} 
              onStopStart={() => setTimerActive(!timerActive)} 
              timerActive={timerActive} 
              breakActive={breakActive}
              />
              <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
            </Row>
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

