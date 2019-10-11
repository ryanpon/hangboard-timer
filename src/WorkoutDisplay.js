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
      100
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  setList() {
    // excludes last rest as this will be included in rest between sets
    const format = _(this.props.reps)
      .range()
      .flatMap(repetition =>
        [[repetition, 'work', this.props.work],
         [repetition, 'rest', this.props.rest]]
      )
      .dropRight() // excludes last rest
      .value()

    const sets = this.props.sets
    return _.range(sets).map(set =>
      ({
        totalLength: _.sum(format.map(f => f[2])) + (sets === (set - 1) ? 0 : this.props.restBetweenSets),
        format: format.concat([[-1, 'set rest', this.props.restBetweenSets]])
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

    const delay = 1
    if (sinceStart < delay) {
      return [0, 'ready', 0, delay - sinceStart]
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
        <Typography variant="h5" component="h2">
          Done
        </Typography>
      )
    }

    const renderCardGrid = ([label, data], _, arr) => (
      <Grid item key={label} xs={12 / arr.length}>
        <Card >
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h5" component="h2">
              {data}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    )

    return (
      <Box style={{padding: '6px'}}>
        <Grid container spacing={1} style={{flexGrow: 1}}>
          {
            [
              ['Set', `${set + 1}/${this.props.sets}`],
              ['Rep', type === 'set rest' ? '--' : `${rep + 1}/${this.props.reps}`],
            ].map(renderCardGrid)
          }
        </Grid>
        <Grid container spacing={1}>
          {
            [
              ['Type', type],
              ['Remaining', remaining.toFixed(1)],
            ].map(renderCardGrid)
          }
        </Grid>
        {type === 'ready' ? <h2>Get ready! {remaining}...</h2> : null}
      </Box>
    )
  }
}

export default WorkoutDisplay
