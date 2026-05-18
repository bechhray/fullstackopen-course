const Person = (props) => <p>{props.name} {props.number}</p>

const Persons = (props) => {
  return (
    <div>
      {props.persons.map((person) => (
        <div key={person.id}>
          <Person name={person.name} number={person.number} /> <button onClick={() => props.deletePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default Persons