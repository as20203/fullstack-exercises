import userService from '../services/users'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
const Users = ({ user }) => {
  const users = useQuery('users', userService.getAll)
  if (users.isLoading) {
    return <div>loading data...</div>
  }
  return (
    <>
      <h2> Users </h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users?.data?.map((user) => (
            <tr key={user?.id}>
              <td>
                <Link to={`/users/${user?.id}`}>
                  {' '}
                  {user?.name || user?.username}
                </Link>
              </td>
              <td> {user?.blogs?.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
