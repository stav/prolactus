import React, { Component } from 'react';
import { Select } from 'grommet';
import spinner from '../icons/spinner';

export default class extends Component {

  state = {
    groups: [],
    icon: true,
  }

  constructor(props) {
    super(props)
    this.handleGroupsMessage = this.handleGroupsMessage.bind(this);
  }

  async componentDidMount() {
    this.props.socket.on('groups', this.handleGroupsMessage)
    this.props.socket.emit('groups');
    this.setState({ icon: spinner })
  }

  handleGroupsMessage(groups) {
    console.log('groups handleGroupsMessage: groups', groups);
    this.setState({groups})
    this.setState({icon: true})
    console.log('       handleGroupsMessage: state', this.state);
  }

  render() {
    return (
      <Select
        placeholder="Groups"
        value={this.props.selected}
        options={this.state.groups}
        onChange={({value}) => {this.props.onChange(value)}}
        dropAlign={{top: "top"}}
        dropHeight="medium"
        labelKey="text"
        margin="small"
        title="Group"
        icon={this.state.icon}
      />
    )
  }

}
