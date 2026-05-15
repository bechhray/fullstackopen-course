import { useState } from 'react'


const StatisticLine = ({ text, value }) => {
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )
}

const DisplayStatistics = ({props}) => {
  
  const all = props.good + props.neutral + props.bad
  const average = ((props.good * 1) + (props.neutral * 0) + (props.bad * -1)) / all
  const positivePercentage = (props.good / all) * 100
  if (all === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <> 
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positivePercentage} %`} />
        </tbody>
      </table>
    </>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const AddGoodFeedback = (good, setGood) => {setGood(good + 1)}
const AddNeutralFeedback = (neutral, setNeutral) => {setNeutral(neutral + 1)}
const AddBadFeedback = (bad, setBad) => {setBad(bad + 1)}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => AddGoodFeedback(good, setGood)} text="good" />
      <Button onClick={() => AddNeutralFeedback(neutral, setNeutral)} text="neutral" />
      <Button onClick={() => AddBadFeedback(bad, setBad)} text="bad" />
      
      <DisplayStatistics props={{ good, neutral, bad}} />
    </div>
  )
}

export default App