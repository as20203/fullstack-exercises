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
  return <p style={{ fontWeight: 'bold' }}>total of {exercisesSum} exercises</p>
}

const Course = ({ course }) => {
  const { parts, name } = course;
  return <>
  <Header course={name} />
    <Content 
      parts={parts}
    />
    <Total 
      parts={parts}
    />
  </>
}
export default Course