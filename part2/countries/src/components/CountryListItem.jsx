import Country from './Country'

const CountryListItem = ({ country, onShow, selectedCountry }) => (
  <div>
    <span>{country.name.common} </span>
    <button onClick={() => onShow(country)}>show</button>
    {selectedCountry && selectedCountry.name.common === country.name.common && (
      <Country country={selectedCountry} />
    )}
  </div>
)

export default CountryListItem