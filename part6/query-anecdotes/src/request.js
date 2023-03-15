import axios from 'axios';
const getId = () => (100000 * Math.random()).toFixed(0)
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
      axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (content) => {
  const object = { content, id: getId(), votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}
export const updateAnecdote = async ({ id, newObject}) => {
  const updatedUrl = `${baseUrl}/${id}`
  const response = await axios.put(updatedUrl, newObject)
  return response.data
}