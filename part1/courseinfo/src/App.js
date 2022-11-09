
const Header = ({ course }) => {
  return <h1>{course}</h1>
}

const Part = ({ part: { name, exercises } }) => {
  return <p>
    {name} {exercises}
  </p>
  
}

const Content = ({ parts }) => {
  return (
    <div>
      {
        parts.map((part, index) => <Part key={index} part={part}  />)
      }
    </div>
  
  )

}

const Total = ({ parts }) => {
  const exercisesSum = parts.reduce((accumulator, part) => accumulator + part.exercises, 0)
  return <p>Number of exercises {exercisesSum}</p>
}
const App = () => {
  const course = 'Half Stack application development'
  const parts = [{
    name: 'Fundamentals of React',
    exercises: 10
  }, 
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 14
  }
]

  return (
    <div>
      <Header course={course} />
      <Content 
        parts={parts}
      />
      <Total 
        parts={parts}
      />
    </div>
  )
}

export default App
