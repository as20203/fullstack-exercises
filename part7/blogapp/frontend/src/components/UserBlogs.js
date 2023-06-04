import { useQuery } from 'react-query'
import userService from '../services/users'
import { useParams } from 'react-router-dom'
const UserBlogs = () => {
  const id = useParams().id

  const userBlogs = useQuery(['userBlogs', id], userService.getUser)
  if (userBlogs.isLoading) {
    return <div>loading data...</div>
  }
  return (
    <>
      {' '}
      <h2>added blogs</h2>
      <ul>
        {userBlogs?.data?.blogs?.map(({ title, id }) => (
          <li key={id}> {title} </li>
        ))}
      </ul>
    </>
  )
}

export default UserBlogs
