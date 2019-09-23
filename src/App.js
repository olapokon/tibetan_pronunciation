import React, { Component } from "react";
import {
  superscripts,
  prefixes,
  roots,
  suffixes,
  secondSuffixes,
  subscriptsTable,
  subscriptsDisplayTable,
  superscribedRootsTable
} from "./tibetanUnicodeData";
import "./App.css";

// manual of standard tibetan p 44 -

class App extends Component {
  constructor() {
    super();
    this.state = {
      root: "",
      superscript: "",
      prefix: "",
      suffix: "",
      secondSuffix: "",
      subscript: "",
      availableSubscripts: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRootChange = this.handleRootChange.bind(this);
    this.createRootDisplay = this.createRootDisplay.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "root") {
      this.setState({
        [name]: value
      });
      this.handleRootChange(value);
    } else if (name === "suffix") {
      this.setState({ secondSuffix: "", [name]: value });
    } else if (name === "superscript") {
      // the la subscript cannot be displayed if there is a superscript
      const prunedSubscripts = [...this.state.availableSubscripts];
      if (prunedSubscripts.includes("\u0F63")) {
        prunedSubscripts.splice(prunedSubscripts.indexOf("\u0F63"), 1);
      }
      this.setState({ [name]: value, availableSubscripts: prunedSubscripts });
    } else {
      this.setState({ [name]: value });
    }
  }

  handleRootChange(value) {
    /* prefixes, superscripts, and suffixes are available for all roots, specific subscripts are available
    to specific roots */

    // reset the affixes in state
    this.setState({
      superscript: "",
      prefix: "",
      suffix: "",
      secondSuffix: "",
      subscript: "",
      availableSubscripts: []
    });

    if (subscriptsTable[value]) {
      this.setState({
        availableSubscripts: [...subscriptsTable[value]]
      });
    }
  }

  createRootDisplay() {
    let rootDisplay = "";
    if (this.state.superscript) {
      rootDisplay =
        this.state.superscript + superscribedRootsTable[this.state.root];
    } else {
      rootDisplay = this.state.root;
    }
    if (this.state.subscript) {
      rootDisplay += subscriptsDisplayTable[this.state.subscript];
    }
    return `${this.state.prefix}${rootDisplay}${this.state.suffix}${this.state.secondSuffix}`;
  }

  render() {
    return (
      <div className="App">
        {/* {"\u0F66\u0FA8\u0FB2"} */}
        <div>{this.createRootDisplay()}</div>
        <br></br>
        <strong>Superscript </strong>
        <select
          name="superscript"
          value={this.state.superscript}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.root &&
            superscripts.map((superscript, index) => (
              <option key={index}>{superscript}</option>
            ))}
        </select>
        <br></br>
        <strong>Prefix </strong>
        <select
          name="prefix"
          value={this.state.prefix}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.root &&
            prefixes.map((prefix, index) => (
              <option key={index}>{prefix}</option>
            ))}
        </select>
        <strong>Root syllable </strong>
        <select
          name="root"
          value={this.state.root}
          onChange={this.handleChange}
        >
          <option></option>
          {roots.map((rootSyllable, index) => (
            <option key={index}>{rootSyllable}</option>
          ))}
        </select>
        <strong>Suffixes </strong>
        <select
          name="suffix"
          value={this.state.suffix}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.root &&
            suffixes.map((suffix, index) => (
              <option key={index}>{suffix}</option>
            ))}
        </select>
        <select
          name="secondSuffix"
          value={this.state.secondSuffix}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.suffix &&
            secondSuffixes.map((suffix, index) => (
              <option key={index}>{suffix}</option>
            ))}
        </select>
        <br></br>
        <strong>Subscript </strong>
        <select
          name="subscript"
          value={this.state.subscript}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.root &&
            this.state.availableSubscripts.map((subscript, index) => (
              <option key={index}>{subscript}</option>
            ))}
        </select>
      </div>
    );
  }
}

export default App;
