import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then((response) => response.data)
}

const getBlog = async ({ queryKey }) => {
  const [, id] = queryKey
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`${baseUrl}/${id}`, config)
  return response.data
}
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(
    `${baseUrl}/${updatedObject.id}`,
    updatedObject,
    config
  )
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${blogId}`, config)
  return blogId
}

const addBlogComment = async (newObject) => {
  const { id, ...comment } = newObject
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    comment,
    config
  )
  return response.data
}

const getBlogComments = async ({ queryKey }) => {
  const [, id] = queryKey

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`${baseUrl}/${id}/comments`, config)
  return response.data
}

const blogService = {
  getAll,
  setToken,
  create,
  update,
  deleteBlog,
  getBlog,
  addBlogComment,
  getBlogComments,
}
export default blogService
