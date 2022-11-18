import { useEffect, useState } from 'react'
import './App.css'
import personService from './services/persons'
const Filter = ({ nameFilter, setNameFilter }) => {
  return <div>
    filter shown with: <input value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
  </div>
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.type === 'info' ? 'notification' : 'error'}>
      {message.text}
    </div>
  )
}

const PersonForm = ({ handleSubmit, setNewName, setPhoneNumber, newName, phoneNumber }) => {
  return <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
    </div>
    <div>number: <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}

const Persons = ({ persons, nameFilter, setPersons, setNotificationMessage }) => {
  const deletePerson = async (name, id) => {
    if (window.confirm(`Delete ${name}`)) {
      try {
        await personService.delete(id)
        setPersons(persons => {
          const updatedPersons = [...persons];
          const index = updatedPersons.findIndex(({ id: personId }) => personId === id )
          if (index !== -1)
            updatedPersons.splice(index, 1);
          return updatedPersons;
        })
      } catch {
        setNotificationMessage({type: 'error', text: `Information of ${name} has been removed from the server.`})
        setTimeout(() => {
          setNotificationMessage('')
        }, 5000)
      }
     
    }
  }
  return <>
    {persons.filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase())).map(({ name, number, id }) => <p key={id}> {name} {number} <button onClick={() => deletePerson(name, id)}> delete </button> </p>)}
  </>
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    const fetchPersons = async() => {
      const retrievedPersons = await personService.getAll()
      if (retrievedPersons?.data)
        setPersons(retrievedPersons.data)
    }
    fetchPersons()
  }, [])
  const addToPhoneBook = async (newPerson = {}) => {
    const person = await personService.create(newPerson)
    return person?.data
  };
  const checkNameInPhoneBook = (phoneBook = [], submittedName = '') => {
    const person = { index: -1, id: -1 };

    const submittedNameExists = phoneBook.some(({ name, id }, index) => {
      if(name === submittedName){
        person.id = id;
        person.index = index;
        return true
      }
      return false;
    });
    return { submittedNameExists, ...person };
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const { submittedNameExists, index, id } = checkNameInPhoneBook(persons, newName);
    if (submittedNameExists && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) ) {
      try {
        const updatedPersonNumber = { ...persons[index] ,number: phoneNumber };
        await personService.update(id, updatedPersonNumber)
        setNotificationMessage({type: 'info', text: `Updated ${newName}'s phone number.`})
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setPersons(persons => {
          const updatedPerson = [...persons];
          updatedPerson[index] = updatedPersonNumber;
          return updatedPerson;
        })
      } catch (error) {
        setNotificationMessage({type: 'error', text: error?.response?.data})
        setTimeout(() => {
          setNotificationMessage('')
        }, 5000)
      }
    }
    if (!submittedNameExists) {
      try {
        const newPerson = { name: newName, number: phoneNumber };
        const { id } = await addToPhoneBook(newPerson)
        newPerson.id = id;
        setNotificationMessage({type: 'info', text: `Added ${newName}`})
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setPersons(persons => {
          const updatedPersons = [...persons];
          updatedPersons.push(newPerson)
          return updatedPersons;
        })
      } catch (error) {
        setNotificationMessage({type: 'error', text: error?.response?.data })
        setTimeout(() => {
          setNotificationMessage('')
        }, 5000)
      }
     
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {
      notificationMessage &&
        <Notification message={notificationMessage} />
      }
      <Filter nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <h3> add a new </h3>
      <PersonForm
        handleSubmit={handleSubmit}
        setNewName={setNewName}
        setPhoneNumber={setPhoneNumber}
        newName={newName}
        phoneNumber={phoneNumber} />

      <h3>Numbers</h3>
      <Persons setNotificationMessage={setNotificationMessage} nameFilter={nameFilter} persons={persons} setPersons={setPersons} />
    </div>
  )
}

export default App