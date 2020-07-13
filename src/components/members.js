import React from 'react';
import { Select } from 'grommet';

export default (props) => (
  <Select
    placeholder="Members"
    value={props.selected}
    options={props.members}
    onChange={({value}) => {props.onChange(value)}}
    disabled={props.disabled}
    dropAlign={{top: "top"}}
    dropHeight="medium"
    labelKey="text"
    margin="small"
    title="Member"
    icon={props.icon}
  />
)
