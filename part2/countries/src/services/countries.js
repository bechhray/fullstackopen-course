import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'

const getAll = () => {
  const get_url = `${baseUrl}/api/all`
  return axios.get(get_url).then(response => response.data)
}

const getByName = (name) => {
  const get_url = `${baseUrl}/api/name/${name}`
  return axios.get(get_url).then(response => response.data)
}

export default { getAll, getByName }