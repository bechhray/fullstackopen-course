const Filter = (props) => (
  <div>
    find countries <input 
      value={props.filter}
      onChange={props.onChange}
    />
  </div>
)

export default Filter