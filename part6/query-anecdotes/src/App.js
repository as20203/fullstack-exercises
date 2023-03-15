import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getAnecdotes, updateAnecdote } from './request';
import { useNotificationDispatch } from './NotificationContext';

const App = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()
    const updatedAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      const anecdoteIndex = anecdotes.findIndex(anecdote => anecdote.id === updatedAnecdote.id);
      anecdotes[anecdoteIndex] = updatedAnecdote;
      queryClient.setQueryData('anecdotes', anecdotes)
    },
  });

  const handleVote = (anecdote) => {
    updatedAnecdoteMutation.mutate({id: anecdote.id, newObject: {...anecdote, votes: anecdote.votes + 1}})
    dispatch({ type: 'SET_NOTIFICATION', payload: `anecdote '${anecdote.content}' voted` })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    },  5000)

  }

  const result = useQuery('anecdotes',getAnecdotes, { 
    retry: 1,     
    refetchOnWindowFocus: false
 })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problem in server.</div>
  }
  const anecdotes = result?.data;

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
