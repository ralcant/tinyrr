import { redirectTo } from "@reach/router";
import React, { Component } from "react";
import { getUrlFromDatabase } from "../../utilities";

export default class Redirecter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      success: true,
      getMessage: "",
    };
  }
  async componentDidMount() {
    let response = await getUrlFromDatabase(this.props.short);
    this.setState(
      { url: response.original, getMessage: response.msg, success: response.success },
      () => {
        if (this.state.success) {
          window.location.href = this.state.url;
        }
      }
    );
  }
  render() {
    return (
      <>
        {this.state.success ? (
          <div>Redirecting you to {this.state.url}</div>
        ) : (
          <div>
            <div>There was an error: {this.state.getMessage}</div>
            <button>
              <a href="/">Create a new link</a>
            </button>
          </div>
        )}
      </>
    );
  }
}
