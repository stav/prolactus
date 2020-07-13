import React from 'react';
import { Box, Button, Heading } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';

export default (props) => (
  <Box
    tag='header'
    align='center'
    justify='between'
    direction='row'
    elevation='medium'
    background='brand'
    gridArea={props.gridArea}
    style={{ zIndex: '1' }}
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    >
    <Heading level='3' margin='none'>Milky Reaction</Heading>
    <Button
      icon={<MenuIcon />}
      onClick={props.onClick}
    />
   </Box>
)
