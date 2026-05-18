import { useState, useEffect } from 'react'

import personsService from './services/persons'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        const updatedPerson = { ...person, number: newNumber }
        updatePerson(person.id, updatedPerson)
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    personsService.create(personObject)
       .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${returnedPerson.name}`)
          setNotificationType('success')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
       })
       .catch(error => {
          setNotification(error.response.data.error)
          setNotificationType('error')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
       })

  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deletePerson(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setNotification(`Deleted ${person.name}`)
        setNotificationType('success')
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
        .catch(error => {
          setNotification(`Information of ${person.name} has already been removed from server`)
          setNotificationType('error')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })  
    }
  }

  const updatePerson = (id, newObject) => {
    personsService.update(id, newObject).then(returnedPerson => {
      setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
      setNotification(`Updated ${returnedPerson.name}'s number`)
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
    .catch(error => {
      setNotification(`Information of ${newObject.name} has already been removed from server`)
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setPersons(persons.filter(p => p.id !== id))
    })
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />  
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} /> 
    </div>
  )
}

export default App