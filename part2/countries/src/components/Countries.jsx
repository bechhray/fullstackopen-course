import CountryListItem  from "./CountryListItem"
import Country from './Country'

const Countries = ({ countries, onShow, selectedCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    const country = countries[0]
    return <Country country={country} />
  }
  return (
      <> 
      {countries.map(country => <CountryListItem key={country.name.common} country={country} onShow={onShow} selectedCountry={selectedCountry} />)}
      </>
  )
}

export default Countries