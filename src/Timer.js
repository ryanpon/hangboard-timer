import React from 'react'
// import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import WorkoutDisplay from './WorkoutDisplay.js'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      running: false,

      work: '6',
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
          id="outlined-number"
          label={label}
          key={label}
          value={value}
          onChange={changeFn}
          type="number"
          InputLabelProps={{shrink: true}}
          margin="normal"
          variant="outlined"
        />
      )
    )

    return (
      <Box style={{padding: '2px'}}>
        <Box>
          {
            renderInputs([
              ['Work', this.state.work, this.handleChange('work')],
              ['Rest', this.state.rest, this.handleChange('rest')],
              ['Reps', this.state.reps, this.handleChange('reps')],
              ['Sets', this.state.sets, this.handleChange('sets')],
              ['Rest between sets', this.state.restBetweenSets, this.handleChange('restBetweenSets')]
            ])
          }
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth="true"
          onClick={this.start}
        >
          Start
        </Button>
      </Box>
    )
  }

  renderRunning() {
    return (
      <Box>
        <WorkoutDisplay
          work={parseInt(this.state.work)}
          rest={parseInt(this.state.rest)}
          reps={parseInt(this.state.reps)}
          sets={parseInt(this.state.sets)}
          restBetweenSets={parseInt(this.state.restBetweenSets)}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth="true"
            onClick={this.stop}
          >
            Stop
          </Button>
        </Box>
      </Box>
    )
  }

  render() {
    return (
      <Box>
        <Box>
          <Typography variant="h6" component="h6">
            Hangboard Repeaters
          </Typography>
        </Box>
        <hr/>
        <Box>
          {this.state.running ? this.renderRunning() : this.renderStopped()}
        </Box>
      </Box>
    )
  }
}

export default Timer
