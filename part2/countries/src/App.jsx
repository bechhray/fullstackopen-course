import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import countriesService from './services/countries'


const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [matchingCountries, setMatchingCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    getAllCountriesNames()
  }, [])

  const getAllCountriesNames = () => {
    countriesService.getAll().then(initialCountries => {
      setCountries(initialCountries)
    })
  }
  const handleShowButtonClick = (country) => {
    if (selectedCountry && selectedCountry.name.common === country.name.common) {
      setSelectedCountry(null)
      return
    }
    countriesService.getByName(country.name.common).then(countryData => {
      setSelectedCountry(countryData)
    })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    if (event.target.value === '') {
      setMatchingCountries([])
      return
    }
    const matching = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    setMatchingCountries(matching)
  }


  return (
    <div>
      <Filter filter={filter} onChange={handleFilterChange} />
      <Countries countries={matchingCountries} onShow={handleShowButtonClick} selectedCountry={selectedCountry} />
    </div>
  )
}

export default App