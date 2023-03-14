import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice  = createSlice({
  name: 'anecdote', 
  initialState: [],
  reducers: {
    incrementVote(state, action) {
      const updatedAnecdotes = [...state ];
      const anecdoteIndex = updatedAnecdotes.findIndex(({ id }) =>  id === action.payload.id);
      if (anecdoteIndex === -1) return [...state ]
      updatedAnecdotes[anecdoteIndex] = action.payload
      return updatedAnecdotes
    },
    appendAnecdote(state, action) {
      return [...state, action.payload];
    },
    setAnecdotes(state, action) {
      return [...state, ...action.payload];
    }
  },
})

export const { incrementVote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const  createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    console.log({ newAnecdote });
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const incrementAnecdoteVote = (anecdoteId, updatedAnecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.updateAnecdote(anecdoteId, updatedAnecdote)
    dispatch(incrementVote(newAnecdote))
  }    
}
export default anecdoteSlice.reducer
