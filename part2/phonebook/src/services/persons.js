import axios from 'axios';
// const baseUrl = `https://phonebook-backend-as20203.fly.dev/api/persons`
const baseUrl = `http://localhost:3001/api/persons`

const getAll = () => {
    return axios.get(baseUrl)
  }
  
  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }
  
  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  }

  const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
  }
  
  const service = { 
    getAll: getAll, 
    create: create, 
    update: update,
    delete: deletePerson, 
  }
  export default  service