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
    this.createTranscriptionDisplay = this.createTranscriptionDisplay.bind(
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

  createTranscriptionDisplay() {
    const rootsArray = Object.keys(roots);
    let currentRoot = roots[this.state.root] ? roots[this.state.root] : "";
    let tone = "";
    let diairesis = false;
    let suffix = "";

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

    // determine if there is change in the root, based on a prefix, superscript, or subscript
    // the root change of the subscript overrides the root change for a third column root with prefix
    if (this.state.prefix || this.state.superscript) {
      if (rootColumn === "third") {
        currentRoot = modifiedThirdColumn[this.state.root];
      } else if (rootColumn === "fourth") {
        tone = "high";
      }
    }

    if (this.state.subscript) {
      // ra subscript
      if (this.state.subscript === "\u0F62") {
        if (this.state.root !== "\u0F58" && this.state.root !== "\u0F66") {
          currentRoot = currentRoot.slice(0, -1) + "ra";
        }
        // la subscript
      } else if (this.state.subscript === "\u0F63") {
        if (this.state.root === "\u0F5F") {
          currentRoot = "da";
          tone = "low";
        } else {
          currentRoot = "la";
          tone = "high";
        }
        // ya subscript
      } else if (this.state.subscript === "\u0F61") {
        if (this.state.root === "\u0F58") {
          currentRoot = "nya";
          tone = "low";
        } else if (this.state.root === "\u0F54") {
          currentRoot = "ca";
          tone = "high";
        } else if (this.state.root === "\u0F55") {
          currentRoot = "cha";
          tone = "high";
        } else if (this.state.root === "\u0F56") {
          currentRoot = "cha";
          tone = "low";
        } else {
          currentRoot = currentRoot.slice(0, -1) + "ya";
        }
      }
    }

    if (this.state.suffix) {
      if (
        this.state.suffix === "\u0F51" ||
        this.state.suffix === "\u0F53" ||
        this.state.suffix === "\u0F63" ||
        this.state.suffix === "\u0F66"
      ) {
        diairesis = true;
      }
      suffix = suffixes[this.state.suffix];
    }

    let transliterationDisplay = currentRoot;
    if (diairesis) transliterationDisplay += "\u0308";
    if (tone === "high") transliterationDisplay += "\u0301";
    if (tone === "low") transliterationDisplay += "\u0300";
    transliterationDisplay += suffix;

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
          {this.createTranscriptionDisplay()}
        </div>
        <br></br>
        Superscript
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
        Prefix
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
        Root syllable
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
        Suffixes
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
        Subscript
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
