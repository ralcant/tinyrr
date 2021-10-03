import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Skeleton.css";
import { createUrl } from "../../utilities";
//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      short: "",
      original: "",
      probability: 0,
      isRestarted: true,
      success: true,
      createdMessage: "",
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }
  onChangeShort = (evt) => {
    this.setState({ short: evt.target.value });
  };
  onChangeOriginal = (evt) => {
    // this.setState({original: })
    this.setState({ original: evt.target.value });
  };
  onChangeProbability = (evt) => {
    // this.setState({original: })
    this.setState({ probability: evt.target.value });
  };
  onCreate = async (evt) => {
    let response = await createUrl(this.state.short, this.state.original, this.state.probability);
    this.setState({ isRestarted: false, success: response.success, createdMessage: response.msg });
  };
  restart = () => {
    this.setState({
      short: "",
      original: "",
      probability: 0,
      isRestarted: true,
      success: true,
      createdMessage: "",
    });
  };
  render() {
    return (
      <>
        Input the short version:
        <textarea value={this.state.short} onChange={this.onChangeShort} />
        Input your url:
        <textarea value={this.state.original} onChange={this.onChangeOriginal} />
        Input your probability:
        <textarea value={this.state.probability} onChange={this.onChangeProbability} />
        <button onClick={this.onCreate}> Shorten url!</button>
        {!this.state.isRestarted && (
          <div>
            {this.state.success ? "Yay!" : "Uh oh"}
            {this.state.createdMessage}
            <button onClick={this.restart}> Create a new one?</button>
          </div>
        )}
      </>
    );
  }
}

export default Skeleton;
