import { useState } from 'react'

const DisplayStatistics = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
)
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const AddGoodFeedback = (good, setGood) => {setGood(good + 1)}
const AddNeutralFeedback = (neutral, setNeutral) => {setNeutral(neutral + 1)}
const AddBadFeedback = (bad, setBad) => {setBad(bad + 1)}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => AddGoodFeedback(good, setGood)} text="good" />
      <Button onClick={() => AddNeutralFeedback(neutral, setNeutral)} text="neutral" />
      <Button onClick={() => AddBadFeedback(bad, setBad)} text="bad" />
      <h1>statistics</h1>
      <DisplayStatistics text="good" value={good} />
      <DisplayStatistics text="neutral" value={neutral} />
      <DisplayStatistics text="bad" value={bad} />
    </div>
  )
}

export default App