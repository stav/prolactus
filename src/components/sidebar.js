import React, { Component } from 'react';
import { Box, Layer, Button, Collapsible } from 'grommet';
import { FormClose as FormCloseIcon } from 'grommet-icons';

const Sidebar = (props) => (
  <ul>
    <li> email: {props.email} </li>
    <li> error: {props.error} </li>
    <li> size: {props.size} </li>
  </ul>
)

export default class extends Component {

  render() {
    return (
      (!this.props.showSidebar || this.props.size !== 'small') ? (
        <Collapsible
          direction="horizontal" open={this.props.showSidebar}
          gridArea={this.props.gridArea}
          >
          <Box
            flex
            width='medium'
            background='light-2'
            elevation='small'
            align='center'
            justify='center'
            >
            <Sidebar
              email={this.props.email}
              error={this.props.error}
              size={this.props.size}
            />
          </Box>
        </Collapsible>
      ): (
        <Layer>
          <Box
            background='light-2'
            tag='header'
            justify='end'
            align='center'
            direction='row'
            >
            <Button
              icon={<FormCloseIcon />}
              onClick={this.props.onClick}
            />
          </Box>
          <Box
            fill
            background='light-2'
            align='center'
            justify='center'
            >
            <Sidebar
              email={this.props.email}
              error={this.props.error}
              size={this.props.size}
            />
          </Box>
        </Layer>
      )
    )
  }

}
