import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch (action?.type) {
    case 'LOGGED_IN':
      return { ...action.data }
    case 'clear':
      return null
    default:
      return state
  }
}

const userContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <userContext.Provider value={[user, userDispatch]}>
      {props.children}
    </userContext.Provider>
  )
}

export default userContext
