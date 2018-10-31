import React, { Component } from "react";
import brain from "brain.js";
import data from "./data.json";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      speech: false,
      command: "",
      result: ""
    };
  }

  componentDidMount() {
    this.voiceRecognition();
  }

  // componentDidUpdate() {
  //   this.getResult(this.state.command);
  // }

  // Voice Recognition
  voiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.addEventListener("result", e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join(" ");

      this.setState({ command: transcript });
    });

    recognition.addEventListener("start", e => {
      this.setState({ command: "" });
      // recognition.start();
    });

    recognition.addEventListener("end", e => {
      // this.setState({ command: "" });
      recognition.start();
      this.getResult(this.state.command);
    });

    recognition.start();
  }

  getResult(cmd) {
    const network = new brain.recurrent.LSTM();
    const trainingData = data.map(item => ({
      input: item.input,
      output: item.output
    }));
    network.train(trainingData, {
      iterations: 200
    });
    if (cmd) {
      const output = network.run(cmd);
      this.setState({ result: output });
    }
  }

  render() {
    return (
      <div className="App">
        <button
          className="btn btn-warning"
          onClick={() =>
            this.setState(prevState => ({ speech: !prevState.speech }))
          }
        >
          {this.state.speech ? "Stop " : "Start "}
          Speech
        </button>
        <br />
        <input
          className="form-control my-2"
          type="text"
          value={this.state.command}
          disabled
        />
        <h2 className="jumbotron">{this.state.result}</h2>
      </div>
    );
  }
}

export default App;
