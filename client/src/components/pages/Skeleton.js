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
    if (this.state.success) {
      this.setState({
        short: "",
        original: "",
        probability: 0,
        isRestarted: true,
        success: false,
        createdMessage: "",
      });
    } else {
      this.setState({
        isRestarted: true,
        success: true,
      });
    }
  };
  getInputComponent = () => {
    return (
      <>
        <div className="u-flexColumn">
          <div className="u-flex u-flex-alignCenter Home-inputContainer">
            Input your url:
            <textarea
              className="Home-input"
              value={this.state.original}
              onChange={this.onChangeOriginal}
              // rows={2} //so that the horizontal scroll would show up
            />
          </div>
          <div className="u-flex u-flex-alignCenter Home-inputContainer">
            Input your alias:
            <textarea
              className="Home-input"
              value={this.state.short}
              onChange={this.onChangeShort}
              rows={1}
            />
          </div>
          <div className="u-flex u-flex-alignCenter Home-inputContainer">
            <div>
              <span> Input the probability</span>
              <br></br>
              <span>of successfull redirect:</span>
            </div>

            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              className="Home-input"
              value={this.state.probability}
              onChange={this.onChangeProbability}
            />
          </div>
        </div>
        <div className="u-flex u-flex-justifyCenter">
          <button className="Home-shortenUrlButton" onClick={this.onCreate}>
            Shorten url!
          </button>
        </div>
      </>
    );
  };
  getFeedbackComponent = () => {
    return (
      <>
        <div className="u-flex u-flex-alignCenter u-flex-justifyCenter u-flexColumn Home-feedbackContainer">
          <span
            className={
              "Home-feedbackMessage " +
              (this.state.success ? "Home-successMessage" : "Home-failureMessage")
            }
          >
            {this.state.success ? "Yay!" : "Uh oh :0"}
          </span>
          <span> {this.state.createdMessage} </span>
          {this.state.success && (
            <div className="u-flex u-flex-justifyCenter u-flex-alignCenter">
              <span>See the result at:</span>
              <div className="Home-feedbackLinkContainer">
                <a target="_blank" href={`/${this.state.short}`}>
                  {this.state.short}
                </a>
              </div>
            </div>
          )}

          <button className={"Home-shortenUrlButton"} onClick={this.restart}>
            {this.state.success ? "Create a new one?" : "Try again!"}
          </button>
        </div>
      </>
    );
  };
  render() {
    return (
      <div
        className="u-flex u-flex-alignCenter u-flex-justifyCenter u-flexColumn Home-container"
        // style={{ backgroundImage: Background }}
      >
        {/* <img src={"https://i.kym-cdn.com/photos/images/original/002/136/427/925"} /> */}
        <span className="Home-title">Tinyurr: RickRoll version</span>
        <img
          alt="rickroll"
          src={"https://www.icegif.com/wp-content/uploads/rickroll-icegif-1.gif"}
        />
        <div>{this.state.isRestarted ? this.getInputComponent() : this.getFeedbackComponent()}</div>
      </div>
    );
  }
}

export default Skeleton;
