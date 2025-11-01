import React, { useState } from 'react'
import { Autocomplete, TextField } from "@mui/material";

const AutoCompleteDropdown = ({ data, labelText, customID, customValue, customSetFunction }) => {
  return (
    <Autocomplete
      className="w-full"
      id={customID}
      options={data.sort((a, b) => a.category.localeCompare(b.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) =>
        // Handles both objects and strings (for freeSolo or bad values)
        typeof option === "string" ? option : (option && option.label) ? option.label : ""
      }
      value={customValue}
      onChange={(event, newValue) => {
        customSetFunction(newValue.label);
      }}
      required={true}
      renderInput={(params) => <TextField {...params} label={labelText} required />}
    />
  );
};


export default AutoCompleteDropdown