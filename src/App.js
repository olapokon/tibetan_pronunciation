import React, { Component } from "react";
import {
  superscripts,
  prefixes,
  roots,
  modifiedThirdColumn,
  suffixes,
  secondSuffixes,
  subscriptsTable,
  subscriptsDisplayTable,
  superscribedRootsTable
} from "./tibetanUnicodeData";
import "./App.css";
import { throwStatement } from "@babel/types";

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
    this.createTransliterationDisplay = this.createTransliterationDisplay.bind(
      this
    );
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
      // remove la from the subscripts menu if a superscript is selected and clear current subscript
      if (value) {
        const prunedSubscripts = [...this.state.availableSubscripts];
        if (prunedSubscripts.includes("\u0F63")) {
          prunedSubscripts.splice(prunedSubscripts.indexOf("\u0F63"), 1);
        }
        this.setState({
          [name]: value,
          availableSubscripts: prunedSubscripts,
          subscript: ""
        });
      } else {
        // if the superscript is deselected, load all subscripts for the current root
        this.setState({
          availableSubscripts: [...subscriptsTable[this.state.root]],
          [name]: value
        });
      }
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

  createTransliterationDisplay() {
    const rootsArray = Object.keys(roots);
    let transliterationDisplay = roots[this.state.root];

    // determine if the root belongs to the third or fourth column
    let rootColumn = "";
    if (
      rootsArray.indexOf(this.state.root) > 15 &&
      rootsArray.indexOf(this.state.root) < 21
    ) {
      rootColumn = "third";
    } else if (
      rootsArray.indexOf(this.state.root) > 24 &&
      rootsArray.indexOf(this.state.root) < 29
    ) {
      rootColumn = "fourth";
    }

    if (this.state.prefix || this.state.superscript) {
      if (rootColumn === "third") {
        transliterationDisplay = modifiedThirdColumn[this.state.root];
      }
    }

    // add the suffix, using the modified version
    // if the root belongs to the fourth column and there is a prefix or subscript
    if (this.state.suffix) {
      if (this.state.prefix || this.state.superscript) {
        if (rootColumn === "fourth") {
          transliterationDisplay += suffixes[this.state.suffix][1];
        }
      } else {
        transliterationDisplay += suffixes[this.state.suffix][0];
      }
    } else if (this.state.prefix || this.state.superscript) {
      if (rootColumn === "fourth") {
        transliterationDisplay += "\u0301";
      }
    }

    return transliterationDisplay;
  }

  render() {
    return (
      <div className="App">
        {/* 
        diairesis: \u0308
        high tone: \u0301
        low tone: \u0300
        */}
        <div id="display">{this.createRootDisplay()}</div>
        <br></br>
        <div id="transliterationDisplay">
          {this.createTransliterationDisplay()}
        </div>
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
          {Object.keys(roots).map((rootSyllable, index) => (
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
            Object.keys(suffixes).map((suffix, index) => (
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
