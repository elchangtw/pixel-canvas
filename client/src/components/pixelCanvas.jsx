import React from 'react';
import styles from "./pixelCanvas.css";

import { canvasFunctions } from "./canvasInterface/canvasFunctions.jsx";
import CanvasInterface from "./canvasInterface/canvasInterface.jsx";
import UserInterface from "./userInterface/userInterface.jsx";
const server_url = 'http://localhost:3000';

class PixelCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'unknown-user',
      color: '#607d8b',
      onCooldown: false,
      canvasList: [],
      currCanvas: 0
    }
    this.changeUserName = this.changeUserName.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.postPixelHandler = this.postPixelHandler.bind(this);
    this.runTimer = this.runTimer.bind(this);
    this.selectCanvas = this.selectCanvas.bind(this);
  }

  componentDidMount() {
    fetch(server_url + '/api/canvaslist', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .catch((err) => {
        console.error(err);
        reject(err);
      })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
        this.setState({
          canvasList: result
        });
      });
  }

  changeUserName(name) {
    this.setState({
      userName: name
    });
  }

  changeColor(color) {
    this.setState({
      color: color
    });
  }

  postPixelHandler(rowNum, colNum) {
    if (!this.state.onCooldown) {
      var pixelData = {
        rowNum: rowNum,
        colNum: colNum,
        RGBA_channels: canvasFunctions.hexToRGBAArray(this.state.color),
        lastEditedBy: this.state.userName,
        lastEditedAt: new Date()
      }
      console.log(pixelData);
      this.setState({
        onCooldown: true
      });
      this.runTimer();
  
      fetch(server_url + '/api/canvas', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(pixelData)
      })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          console.log("POST success (probably).")
        });
    } else {
      alert('Please wait 3 seconds between placing pixels.');
    }
  }

  runTimer () {
    setTimeout(() => {
      this.setState({
        onCooldown: false
      });
    }, 3000); // 3 second timer
  }

  selectCanvas (event) {
    this.setState({
      currCanvas: event.target.value
    });
  }

  render() {
    return (
      <div className={styles.pixel_canvas}>
        <div className={styles.container}>
          <div className={styles.user_interface}>
            <UserInterface selectCanvas={this.selectCanvas} canvasList={this.state.canvasList} currCanvas={this.state.currCanvas} userName={this.state.userName} color={this.state.color} onCooldown={this.state.onCooldown} changeUserName={this.changeUserName} changeColor={this.changeColor} />
            <h1 className={styles.header}>Pixel Canvas</h1>
            <p className={styles.description_text}>Pick a pixel. Place a pixel. Defend your pixel. Do (not) fight over pixels.</p>
          </div>
          <div className={styles.canvas}>
            <CanvasInterface colorHex={this.state.color} postPixelHandler={this.postPixelHandler} currCanvas={this.state.currCanvas}/>
          </div>
        </div>
      </div>
    );
  }
}


export default PixelCanvas;