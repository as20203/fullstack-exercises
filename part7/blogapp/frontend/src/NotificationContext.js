import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  console.log({ state, action })
  switch (action.type) {
    case 'info':
      return { type: action.type, text: action.text }
    case 'error':
      return { type: action.type, text: action.text }
    case 'clear':
      return { type: 'clear', text: '' }
    default:
      return state
  }
}

const notificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    type: 'clear',
    text: '',
  })

  return (
    <notificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </notificationContext.Provider>
  )
}

export default notificationContext
