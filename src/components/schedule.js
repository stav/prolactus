import React, { Component } from 'react';
import {
  Box,
  Text,
  Button,
  Calendar,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from 'grommet';
import { Shop as ShopIcon } from 'grommet-icons';

function tableHeaderRow(data) {
  return data[0][0].trim().length ? data[0] : data[0].slice(1)
}

function cleanTableColumns(data) {
  let _data = data.slice(); // make a copy of the data array
  if (_data.length > 1 && _data[0][0].trim().length === 0) {
    _data = _data.map(row => row.slice(1)); // remove fist column
  }
  return _data.slice(1) // ignore first row
}

const OrderTable = (props) => (
  <Table caption="Custom Theme Table">
    <TableHeader>
      <TableRow>
        {tableHeaderRow(props.data).map(col => (
          <TableCell key={col} scope="col">
            <Text>{col}</Text>
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {cleanTableColumns(props.data).map((row, rid) => (
        <TableRow key={rid}>
          {row.map((col, cid) => (
            <TableCell key={cid}>
              <Text>{col}</Text>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

function getDateISO8601(string) {
  const date = new Date(string);
  const month = ('' + (date.getMonth()+1)).padStart(2, '0');
  const day = ('' + date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function selectedDates(selectedDate) {
  const dates = [(new Date()).toISOString()]
  // console.log('schedule selectedDates', selectedDate, dates)
  if (selectedDate) {
    dates.push((new Date(`${selectedDate}T12:00:00`)).toISOString())
  }
  return dates
}

export default class extends Component {

  state = {
    orderDays: {},
    driverDays: '',
    drivingDay: '',
    drivingDates: '',
    selectedDate: '',
  }

  constructor(props) {
    super(props)
    this.handleSelectDate     = this.handleSelectDate.bind(this);
    this.handleOrderMessage   = this.handleOrderMessage.bind(this);
    this.handleDriversMessage = this.handleDriversMessage.bind(this);
    this.handleDrivingMessage = this.handleDrivingMessage.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('order'       , this.handleOrderMessage)
    this.props.socket.on('drivers'     , this.handleDriversMessage)
    this.props.socket.on('drivingDates', this.handleDrivingMessage)
  }

  handleSelectDate(date) {
    const selectedDate = getDateISO8601(date);
    // console.log('schedule handleSelectDate', typeof date, date, `(${selectedDate})`, this.state.driverDays[selectedDate], this.state.driverDays)
    this.setState({selectedDate})
  }

  handleDriversMessage(driversMatrix) {
    // console.log('schedule handleDriversMessage: driversMatrix', driversMatrix);
    const drivingDay = driversMatrix[1][1].split(',')[0];
    // console.log('         handleDriversMessage: day', drivingDay);
    const driverDays = {};
    for (let row of driversMatrix.splice(1)) {
      driverDays[getDateISO8601(row[1])] = `${row[2].trim()} ${row[3].trim()}`.trim();
    }
    this.setState({driverDays, drivingDay})
    // console.log('         handleDriversMessage: state', this.state);
    this.props.socket.emit('drivingDay', drivingDay);
  }

  handleDrivingMessage(drivingDates) {
    // console.log('schedule handleDrivingMessage: drivingDates', drivingDates)
    this.setState({drivingDates})
    this.requestOrderDate()
  }

  requestOrderDate() {
    let drivingDates, date;
    this.setState(prevState => {
      drivingDates = prevState.drivingDates;
      date = drivingDates.pop();
      return {drivingDates}
    })
    console.log('schedule requestOrderDate: date', date)
    this.props.socket.emit('orderDate', date);
  }

  handleOrderMessage(order) {
    const table = order.splice(1);
    const label = order[0];
    console.log('schedule handleOrderMessage: label,table', label, table)
    const dateString = label.match(/, (.+):/)[1];
    console.log('         handleOrderMessage: dateString', dateString)
    const orderDate = getDateISO8601(dateString);
    console.log('         handleOrderMessage', dateString, orderDate)
    this.setState(prevState => {
      const orderDays = prevState.orderDays;
      orderDays[orderDate] = {label, table};
      return {orderDays}
    })
    console.log('         handleOrderMessage', this.state.orderDays)
    this.requestOrderDate()
  }

  render() {
    const { orderDays, driverDays, drivingDay, selectedDate } = this.state;
    const order = orderDays[selectedDate];
    return (
      <Box flex align="start"
        direction={this.props.size === 'small' ? 'column' : 'row'}
        gridArea={this.props.gridArea}
         >
        <Box flex>
          <Text size="xlarge">
            Orders
            {drivingDay ? <strong>- ({drivingDay})</strong> : ''}
          </Text>
          <ul>
            {Object.keys(orderDays).sort().map(orderDate => (
              <li key={orderDate} style={{listStyle:'none'}}>
                <Button
                  label={orderDate}
                  icon={<ShopIcon />}
                  onClick={() => this.setState({selectedDate: orderDate})}
                  margin="xsmall"
                />
              </li>
            ))}
          </ul>
        </Box>

        <Box flex>
          <Calendar
            size={this.props.size === 'large' ? 'medium' : 'small'}
            dates={selectedDates(this.state.selectedDate)}
            onSelect={this.handleSelectDate}
            showAdjacentDays={true}
            daysOfWeek={true}
          />
        </Box>

        <Box flex>
          <Table>
            <TableBody>

              {selectedDate ?
              <TableRow>
                <TableCell scope="row">
                  <strong>Date</strong>
                </TableCell>
                <TableCell>{selectedDate}</TableCell>
              </TableRow>
              : null}

              {driverDays[selectedDate] ?
              <TableRow>
                <TableCell scope="row">
                  <strong>Driver</strong>
                </TableCell>
                <TableCell>{driverDays[selectedDate]}</TableCell>
              </TableRow>
              : null}

            </TableBody>
          </Table>

          {order ?
            <Box>
              <p>{order.label}</p>
              <OrderTable data={order.table} />
            </Box>
          : null}

        </Box>

      </Box>
    )
  }

}
