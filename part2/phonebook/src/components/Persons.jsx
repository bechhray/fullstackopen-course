const Person = (props) => <p>{props.name} {props.number}</p>

const Persons = (props) => {
  return (
    <div>
      {props.persons.map((person) => (
        <Person key={person.id} name={person.name} number={person.number} />
      ))}
    </div>
  )
}

export default Persons