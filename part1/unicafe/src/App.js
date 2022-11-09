import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return <tr><td style={{ padding: '5px' }}>{text}</td><td>{value}{text === 'positive' && ' %'}</td></tr>
}

const StatisticButton = ({ text , setValue }) => {
  return <button 
    style={{ borderRadius: '5px', padding: '5px', margin: '5px' }} 
    onClick={
      () => setValue(value => value + 1)}>{
      text
    }
  </button>
}
const Statistics = ({
  good,
  bad,
  neutral,
  setGood,
  setBad,
  setNeutral
}) => {
  const statisticsSum = good + bad + neutral;
  const postivePercentage = good / statisticsSum * 100;
  const averageScore = ((good * 1) + (bad * -1)) / (statisticsSum)
  const statistics = [
    {
      name: 'good',
      value: good,
      setValue: setGood,
    },
    {
      name: 'neutral',
      value: neutral,
      setValue: setNeutral,
    },
    {
      name: 'bad',
      value: bad,
      setValue: setBad
    },
    {
      name: 'all',
      value: statisticsSum,
    },
    {
      name: 'average',
      value: averageScore,
    },
    {
      name: 'positive',
      value: postivePercentage,
    },
  ]
 
  return (
    <div>
      <h1> give feedback </h1>
      {statistics.map(
        ({ name, setValue }, index ) => {
          return setValue &&  <StatisticButton key={index} text={name} setValue={setValue} />
        }
      )}
      <h1> statistics </h1>
      {statisticsSum > 0 ?
        <table>
          <tbody>
          {statistics.map(
            ({ name, value }, index) =>
              <StatisticLine key={index} text={name} value={value} />
          )}
          </tbody>
        </table> : <div> No feedback Given </div>
      }
    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return <Statistics
    neutral={neutral}
    good={good}
    bad={bad}
    setBad={setBad}
    setGood={setGood}
    setNeutral={setNeutral}
  />

}

export default App