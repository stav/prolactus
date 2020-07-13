import React, { Component } from 'react';
import { Box, Button, Form, FormField } from 'grommet';
import Groups from './groups';
import Members from './members';
import spinner from '../icons/spinner';

const LoginForm = (props) => (
  <Form
    onSubmit={props.onSubmit}
    >
    <FormField required
      placeholder="Password"
      margin="small"
      name="password"
      id="password"
      value="f00disLOVE"
    />
    <Button primary type="submit"
      label={props.label}
      margin="small"
      disabled={!props.valid}
    />
  </Form>
)

export default class extends Component {

  state = {
    gid: '',
    mid: '',
    members: [],
    label: 'Login',
    memberIcon: true,
  }

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.handleLoginMessage = this.handleLoginMessage.bind(this);
    this.handleMembersMessage = this.handleMembersMessage.bind(this);
  }

  componentDidMount() {
    console.log('login componenDidMount: window', window)
    this.props.socket.on('login', this.handleLoginMessage)
    this.props.socket.on('members', this.handleMembersMessage)
  }

  handleMembersMessage(members) {
    console.log('login handleMembersMessage: members', members);
    this.setState({members})
    this.setState({memberIcon: true})
    console.log('    handleMembersMessage: state', this.state);
  }

  handleLoginMessage(result) {
    console.log('login handleLoginMessage: result', result);
    this.setState({label: 'Login'})
    this.props.loginResult(result)
  }

  async submitForm({value}) {
    const body = {
      group: this.state.gid,
      member: this.state.mid.value,
      password: value.password,
    }
    console.log('login submitForm: body', body)
    this.props.socket.emit('login', body);
    this.setState({label: spinner})
  }

  async handleGroupSelect(group) {
    this.props.socket.emit('members', group.value);
    this.setState({gid: group.value, mid: '', members: [], memberIcon: spinner})
  }

  render() {
    return (
      <Box flex align="start" gridArea={this.props.gridArea}>
        <Groups
          onChange={async (group) => await this.handleGroupSelect(group)}
          selected={this.state.gid}
          socket={this.props.socket}
        />
        <Members
          onChange={(mid) => this.setState({mid})}
          disabled={!this.state.gid}
          selected={this.state.mid}
          members={this.state.members}
          icon={this.state.memberIcon}
        />
        <LoginForm
          onSubmit={async (form) => await this.submitForm(form)}
          label={this.state.label}
          valid={Boolean(this.state.gid && this.state.mid)}
        />
      </Box>
    )
  }
}
