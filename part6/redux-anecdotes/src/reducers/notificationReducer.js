import { createSlice } from '@reduxjs/toolkit'

const initialState = '';

const anecdoteNotificationSlice = createSlice({
  name: 'anecdoteNotification', 
  initialState,
  reducers: {
    setAnecdoteNotification(_, action){
      return action.payload
    },
    clearAnecdoteNotification(_, __) {
      return ''
    }
  },
})

export const { setAnecdoteNotification, clearAnecdoteNotification } = anecdoteNotificationSlice.actions
export const  setNotification = (content, time) => {
  return async dispatch => {
    dispatch(setAnecdoteNotification(content))
    setTimeout(() => {
      dispatch(clearAnecdoteNotification())
    }, time)
  }
}
export default anecdoteNotificationSlice.reducer