import { createSlice } from '@reduxjs/toolkit'

const initialState = '';

const anecdoteFilerSlice  = createSlice({
  name: 'anecdoteFilter', 
  initialState,
  reducers: {
    setAnecdoteFilter(_, action){
      return action.payload
    }
  },
})
export const { setAnecdoteFilter } = anecdoteFilerSlice.actions
export default anecdoteFilerSlice.reducer