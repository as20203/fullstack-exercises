import userService from '../services/users'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Table, TableHeader, TableData } from '../styledComponents'
const Users = () => {
  const users = useQuery('users', userService.getAll)
  if (users.isLoading) {
    return <div>loading data...</div>
  }
  return (
    <>
      <h2> Users </h2>
      <Table>
        <thead>
          <tr>
            <TableHeader> Name </TableHeader>
            <TableHeader>blogs created</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users?.data?.map((user) => (
            <tr key={user?.id}>
              <TableData>
                <Link
                  style={{
                    color: 'blue',
                    paddingRight: '5px',
                    textDecoration: 'none',
                    padding: '10px',
                  }}
                  to={`/users/${user?.id}`}
                >
                  {' '}
                  {user?.name || user?.username}
                </Link>
              </TableData>
              <TableData> {user?.blogs?.length}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Users
