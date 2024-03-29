import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementAnecdoteVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter);
    const dispatch = useDispatch()
    const vote = (id, content) => {
        const anecdoteIndex = anecdotes.findIndex(anecdote => anecdote.id === id);
        const votes = anecdotes[anecdoteIndex].votes + 1;
        const updatedAnecdote = { ...anecdotes[anecdoteIndex], votes}
        dispatch(incrementAnecdoteVote(id, updatedAnecdote));
        dispatch(setNotification(`You voted '${content}'`, 5000))

    }

    return  <>
     {[...anecdotes]
     .sort((a,b) => b.votes - a.votes)
     .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
     .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </>    
}

export default AnecdoteList;