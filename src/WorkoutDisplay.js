import React from 'react'
import _ from 'lodash'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

class WorkoutDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      currentDate: new Date(),
      setList: this.setList()
    }
    this.timerID = setInterval(
      () => this.tick(),
      50
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  setList() {
    // excludes last rest as this will be included in rest between sets
    const format = [[0, 'hang', this.props.hang]].concat(
      _(this.props.reps - 1)
        .range()
        .flatMap(repetition =>
          [[repetition + 1, 'rest', this.props.rest],
           [repetition + 1, 'hang', this.props.hang]]
        )
        .value()
    )
    console.log(format)
    const sets = this.props.sets
    return _.range(sets).map(set =>
      ({
        totalLength: _.sum(format.map(f => f[2])) + (set === 0 ? 0 : this.props.restBetweenSets),
        format: (set === 0 ? [] : [[-1, 'set rest', this.props.restBetweenSets]]).concat(format)
      })
    )
  }

  tick() {
    this.setState({currentDate: new Date()})
  }

  diff() {
    const millisecondsSinceStart = this.state.currentDate - this.state.startDate
    const truncatedMs = millisecondsSinceStart % 1000
    const sinceStart = Math.floor(millisecondsSinceStart / 1000)
    if (sinceStart < 0) { throw new Error('wtf') }

    const delay = 5
    if (sinceStart < delay) {
      return [0, 'ready', 0, delay - (millisecondsSinceStart / 1000)]
    }

    const sinceReady = sinceStart - delay

    const setList = this.state.setList
    const workoutLength = _.sum(setList.map(s => s.totalLength))
    if (sinceReady >= workoutLength) {
      return [null, 'done', null, null]
    }

    let elapsed = 0
    const setNum = setList.findIndex(set => {
      if (sinceReady < (elapsed + set.totalLength)) { return true }
      elapsed += set.totalLength
      return false
    })

    const sinceStartOfSet = sinceReady - elapsed
    const set = setList[setNum]
    let setElapsed = 0
    const locationInSet = set.format.findIndex(([rep, type, len]) => {
      if (sinceStartOfSet < (setElapsed + len)) { return true }
      setElapsed += len
      return false
    })

    const sinceStartOfRep = sinceStartOfSet - setElapsed
    const [rep, type, len] = set.format[locationInSet]
    const remaining = ((len - sinceStartOfRep - 1) + (1 - truncatedMs / 1000))
    return [setNum, type, rep, remaining]
  }

  render() {
    const [set, type, rep, remaining] = this.diff()
    if (type === 'done') {
      return (
        <Typography variant="h5">
          Done
        </Typography>
      )
    }

    const renderCardGrid = ([label, data, variant, color], _, arr) => (
      <Grid item key={label} xs={12 / arr.length}>
        <Card >
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant={variant} style={{color: color}}>
              {data}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )

    const setRepFragment = (
      <Grid container spacing={1} style={{flexGrow: 1}}>
        {
          [
            ['Set', `${set + 1}/${this.props.sets}`, 'h5'],
            ['Rep', type === 'set rest' ? '--' : `${rep + 1}/${this.props.reps}`, 'h5'],
          ].map(renderCardGrid)
        }
      </Grid>
    )

    const red    = '#FD3C34'
    const yellow = '#D7B857'
    const green  = '#608761'
    const typeToColor = {
      ready: yellow,
      rest: red,
      hang: green,
      'set rest': red
    }
    const timerFragment = (
      <Grid container spacing={1} style={{flexGrow: 1}}>
        {
          [
            ['Type', type === 'ready' ? 'Get Ready!' : type, 'h3', typeToColor[type]],
            ['Remaining', remaining.toFixed(1), 'h3'],
          ].map(renderCardGrid)
        }
      </Grid>
    )

    return (
      <Box>
        {setRepFragment}
        {timerFragment}
      </Box>
    )
  }
}

export default WorkoutDisplay
