import React, { Component } from "react";
import {
  superscripts,
  prefixes,
  roots,
  suffixes,
  subscriptsTable
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
      subscript: "",
      availableSubscripts: [],
      availableAffixes: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRootChange = this.handleRootChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "root") {
      this.setState({
        [name]: value,
        availableAffixes: ["suffix"]
      });
      this.handleRootChange(value);
    } else {
      this.setState({ [name]: value });
    }
  }

  handleRootChange(value) {
    /* make superscripts and prefixes available if the root belongs to the third or 
    fourth column of the alphabet table, index 16 to the end of the array */
    /* suffixes are available for all roots, specific subscripts are available
    to specific roots */
    const affixes = ["suffix"];
    if (roots.indexOf(value) > 15) {
      affixes.push("prefix");
      affixes.push("superscript");
    }
    if (subscriptsTable[value]) {
      affixes.push("subscript");
      this.setState({
        availableSubscripts: [...subscriptsTable[value]]
      });
    }
    this.setState({ availableAffixes: affixes });
    console.log(affixes);
  }

  render() {
    return (
      <div className="App">
        {/* {"\u0F66\u0FA8\u0FB2"} */}
        <strong>Superscript </strong>
        <select
          name="superscript"
          value={this.state.superscript}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.availableAffixes.includes("superscript") &&
            superscripts.map((superscript, index) => (
              <option key={index}>{superscript}</option>
            ))}
        </select>
        <br></br>
        <strong>Prefix </strong>
        <select name="prefix" value={this.prefix} onChange={this.handleChange}>
          <option></option>
          {this.state.availableAffixes.includes("prefix") &&
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
        <strong>Suffix </strong>
        <select
          name="suffix"
          value={this.state.suffix}
          onChange={this.handleChange}
        >
          <option></option>
          {this.state.availableAffixes.includes("suffix") &&
            suffixes.map((suffix, index) => (
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
          {this.state.availableAffixes.includes("subscript") &&
            this.state.availableSubscripts.map((subscript, index) => (
              <option key={index}>{subscript}</option>
            ))}
        </select>
      </div>
    );
  }
}

export default App;
