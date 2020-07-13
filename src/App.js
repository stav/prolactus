/*
 * TODO: failed password stalls electron comm
 */
import React, { Component } from 'react';
import {
  Grid,
  Grommet,
  ResponsiveContext,
} from 'grommet';
import AppBar from './components/topbar';
import SideBar from './components/sidebar';
import Schedule from './components/schedule';
import UserLogin from './components/login';
import theme from './theme';
import * as api from './api';

export default class extends Component {

  state = {
    showSidebar: true,
    password: '',
    email: '',
    error: '',
  }
  socket = window.io(api.socketBase);

  render() {
    const { showSidebar } = this.state;
    return (
      <Grommet full theme={theme}>
        <ResponsiveContext.Consumer>
          {size => (
            <Grid fill
              areas={[
                { name: 'head', start: [0, 0], end: [2, 0] },
                { name: 'user', start: [0, 1], end: [0, 1] },
                { name: 'main', start: [1, 1], end: [1, 1] },
                { name: 'side', start: [2, 1], end: [2, 1] },
              ]}
              columns={['medium', 'flex', 'medium']}
              rows={['xsmall', 'flex']}
              gap='small'
              >
              <AppBar
                gridArea="head"
                onClick={() => this.setState(prevState => ({ showSidebar: !prevState.showSidebar }))}
              />
              <UserLogin
                gridArea="user"
                socket={this.socket}
                loginResult={(result) => this.setState(result)} // result will contain email & error
              />
              <Schedule
                gridArea="main"
                socket={this.socket}
                size={size}
              />
              <SideBar
                gridArea="side"
                email={this.state.email}
                error={this.state.error}
                showSidebar={showSidebar}
                onClick={() => this.setState({ showSidebar: false })}
                size={size}
              />
            </Grid>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    )
  }

}
