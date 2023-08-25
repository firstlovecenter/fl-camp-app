import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface IdContextType {
  referenceId: string
  continentId: string
  countryId: string
  campusId: string
  setReferenceId: (referenceId: string) => void
  setContinentId: (continentId: string) => void
  setCountryId: (continentId: string) => void
  setCampusId: (continentId: string) => void
}

const IdContext = createContext<IdContextType>({
  referenceId: '',
  continentId: '',
  countryId: '',
  campusId: '',
  setReferenceId: () => null,
  setContinentId: () => null,
  setCountryId: () => null,
  setCampusId: () => null,
})

export const useId = () => {
  return useContext(IdContext)
}

export const IdContextProvider = ({ children }: { children: ReactNode }) => {
  const [referenceId, setReferenceId] = useState<string>(
    sessionStorage.getItem('referenceId') ?? ''
  )

  const setRefId = (referenceId: string) => {
    setReferenceId(referenceId)
    sessionStorage.setItem('referenceId', referenceId)
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
      referenceId,
      continentId,
      countryId,
      campusId,
      setReferenceId: setRefId,
      setContinentId: setContId,
      setCountryId: setCountId,
      setCampusId: setCampId,
    }),
    [referenceId, continentId, countryId, campusId]
  )

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
