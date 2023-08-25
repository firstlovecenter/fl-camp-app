import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface IdContextType {
  earthId: string
  continentId: string
  countryId: string
  campusId: string
  setEarthId: (earthId: string) => void
  setContinentId: (continentId: string) => void
  setCountryId: (continentId: string) => void
  setCampusId: (continentId: string) => void
}

const IdContext = createContext<IdContextType>({
  earthId: '',
  continentId: '',
  countryId: '',
  campusId: '',
  setEarthId: () => null,
  setContinentId: () => null,
  setCountryId: () => null,
  setCampusId: () => null,
})

export const useId = () => {
  return useContext(IdContext)
}

export const IdContextProvider = ({ children }: { children: ReactNode }) => {
  const [earthId, setEarthId] = useState<string>(
    sessionStorage.getItem('earthId') ?? ''
  )

  const setRefId = (earthId: string) => {
    setEarthId(earthId)
    sessionStorage.setItem('earthId', earthId)
  }

  const [continentId, setContinentId] = useState<string>(
    sessionStorage.getItem('continentId') ?? ''
  )

  const setContId = (continentId: string) => {
    setContinentId(continentId)
    sessionStorage.setItem('continentId', continentId)
  }

  const [countryId, setCountryId] = useState<string>(
    sessionStorage.getItem('countryId') ?? ''
  )

  const setCountId = (countryId: string) => {
    setCountryId(countryId)

    sessionStorage.setItem('countryId', countryId)
  }

  const [campusId, setCampusId] = useState<string>(
    sessionStorage.getItem('campusId') ?? ''
  )

  const setCampId = (campusId: string) => {
    setCampusId(campusId)
    sessionStorage.setItem('campusId', campusId)
  }

  const value = useMemo(
    () => ({
      earthId,
      continentId,
      countryId,
      campusId,
      setEarthId: setRefId,
      setContinentId: setContId,
      setCountryId: setCountId,
      setCampusId: setCampId,
    }),
    [earthId, continentId, countryId, campusId]
  )

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
