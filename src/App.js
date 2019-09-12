import React, { useState } from "react";
import {
  superscripts,
  prefixes,
  roots,
  suffixes,
  subscripts
} from "./tibetanUnicodeData";
import "./App.css";

function App() {
  const [stateValues, setStateValues] = useState({
    root: "",
    superscript: "",
    prefix: "",
    suffix: "",
    subscript: "",
    availableAffixes: []
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setStateValues({ ...stateValues, [name]: value });
    if (name === "root") {
      setStateValues({ availableAffixes: [] });
      handleRootChange(value);
    }
  }

  function handleRootChange(value) {
    /* make superscripts and prefixes available if the root belongs to the third or 
    fourth column of the alphabet table, index 16 to the end of the array */
    /* suffixes are available for all roots, specific subscripts are available
    to specific roots */
    if (roots.indexOf(value) && roots.indexOf(value) > 15) {
      setStateValues({
        availableAffixes: ["superscript", "prefix"]
      });
    }
  }

  return (
    <div className="App">
      {/* {"\u0F66\u0FA8\u0FB2"} */}
      <strong>Superscript </strong>
      <select
        name="superscript"
        value={stateValues.superscript}
        onChange={handleChange}
      >
        <option></option>
        {stateValues.availableAffixes.includes("superscript") &&
          superscripts.map((superscript, index) => (
            <option key={index}>{superscript}</option>
          ))}
      </select>
      <br></br>
      <strong>Prefix </strong>
      <select name="prefix" value={stateValues.prefix} onChange={handleChange}>
        <option></option>
        {stateValues.availableAffixes.includes("prefix") &&
          prefixes.map((prefix, index) => (
            <option key={index}>{prefix}</option>
          ))}
      </select>
      <strong>Root syllable </strong>
      <select name="root" value={stateValues.root} onChange={handleChange}>
        <option></option>
        {roots.map((root, index) => (
          <option key={index}>{root}</option>
        ))}
      </select>
      <strong>Suffix </strong>
      <select name="suffix" value={stateValues.suffix} onChange={handleChange}>
        <option></option>
        {suffixes.map((suffix, index) => (
          <option key={index}>{suffix}</option>
        ))}
      </select>
      <br></br>
      <strong>Subscript </strong>
      <select
        name="subscript"
        value={stateValues.subscript}
        onChange={handleChange}
      >
        <option></option>
        {subscripts.map((subscript, index) => (
          <option key={index}>{subscript}</option>
        ))}
      </select>
    </div>
  );
}

export default App;
