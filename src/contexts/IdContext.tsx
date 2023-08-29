import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface IdContextType {
  planetId: string
  continentId: string
  countryId: string
  campusId: string
  setPlanetId: (planetId: string) => void
  setContinentId: (continentId: string) => void
  setCountryId: (continentId: string) => void
  setCampusId: (continentId: string) => void
}

const IdContext = createContext<IdContextType>({
  planetId: '',
  continentId: '',
  countryId: '',
  campusId: '',
  setPlanetId: () => null,
  setContinentId: () => null,
  setCountryId: () => null,
  setCampusId: () => null,
})

export const useChurchId = () => {
  return useContext(IdContext)
}

export const IdContextProvider = ({ children }: { children: ReactNode }) => {
  const [planetId, setPlanetId] = useState<string>(
    sessionStorage.getItem('planetId') ?? ''
  )

  const [continentId, setContinentId] = useState<string>(
    sessionStorage.getItem('continentId') ?? ''
  )

  const [countryId, setCountryId] = useState<string>(
    sessionStorage.getItem('countryId') ?? ''
  )

  const [campusId, setCampusId] = useState<string>(
    sessionStorage.getItem('campusId') ?? ''
  )

  const setRefId = (planetId: string) => {
    setPlanetId(planetId)
    sessionStorage.setItem('planetId', planetId)
  }

  const setContId = (continentId: string) => {
    setContinentId(continentId)
    sessionStorage.setItem('continentId', continentId)
  }

  const setCountId = (countryId: string) => {
    setCountryId(countryId)

    sessionStorage.setItem('countryId', countryId)
  }

  const setCampId = (campusId: string) => {
    setCampusId(campusId)
    sessionStorage.setItem('campusId', campusId)
  }

  const value = useMemo(
    () => ({
      planetId,
      continentId,
      countryId,
      campusId,
      setPlanetId: setRefId,
      setContinentId: setContId,
      setCountryId: setCountId,
      setCampusId: setCampId,
    }),
    [planetId, continentId, countryId, campusId]
  )

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
