import React from 'react'
// import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import WorkoutDisplay from './WorkoutDisplay.js'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      running: false,

      hang: '6',
      rest: '6',
      reps: '6',
      sets: '6',
      restBetweenSets: '120',
    }

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  start() {
    this.setState({
      running: true
    })
  }

  stop() {
    this.setState({
      running: false
    })
  }

  handleChange(name) {
    return event => this.setState({[name]: event.target.value})
  }

  renderStopped() {
    const renderInputs = (fields) => (
      fields.map(([label, value, changeFn], i) =>
        <TextField
          id="input-number"
          label={label}
          key={label}
          value={value}
          onChange={changeFn}
          type="number"
          InputLabelProps={{shrink: true}}
          margin="normal"
        />
      )
    )

    return (
      <Box style={{padding: '2px'}}>
        <Box>
          {
            renderInputs([
              ['Hang', this.state.hang, this.handleChange('hang')],
              ['Rest', this.state.rest, this.handleChange('rest')],
              ['Reps', this.state.reps, this.handleChange('reps')],
              ['Sets', this.state.sets, this.handleChange('sets')],
              ['Rest between sets', this.state.restBetweenSets, this.handleChange('restBetweenSets')]
            ])
          }
        </Box>
      </Box>
    )
  }

  renderRunning() {
    return (
      <Box>
        <WorkoutDisplay
          hang={parseInt(this.state.hang)}
          rest={parseInt(this.state.rest)}
          reps={parseInt(this.state.reps)}
          sets={parseInt(this.state.sets)}
          restBetweenSets={parseInt(this.state.restBetweenSets)}
        />
      </Box>
    )
  }

  render() {
    return (
      <Box>
        <Box style={{padding: '6px'}}>
          <Box>
            {this.state.running ? this.renderRunning() : this.renderStopped()}
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={this.state.running ? this.stop : this.start}
            style={{marginTop: '6px'}}
          >
            {this.state.running ? 'Stop' : 'Start'}
          </Button>
        </Box>
      </Box>
    )
  }
}

export default Timer
