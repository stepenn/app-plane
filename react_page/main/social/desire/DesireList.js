import React, {Component} from 'react';
import DesireItem from './DesireItem'
import Box from './Box'

class DesireList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
        {
          this.props.desires.map((desireItem) => (
            <li key={desireItem.id}>
              <Box sm onClick={() => this.props.onClickDesire(desireItem)} height="160">
                <div style={{
                  fontSize: 20,
                  lineHeight: 2,
                  color: '#d7981d',
                  padding: 60,
                  textAlign: 'center'
                }}>{desireItem.city_name}</div>
              </Box>
            </li>
          ))
        }
      </ul>
    )
  }
}

module.exports = DesireList