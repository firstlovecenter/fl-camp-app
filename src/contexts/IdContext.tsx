import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

interface IdContextType {
  referenceId: string
  setReferenceId: (referenceId: string) => void
}

const IdContext = createContext<IdContextType>({
  referenceId: '',
  setReferenceId: () => null,
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

  const value = useMemo(
    () => ({
      referenceId,
      setReferenceId: setRefId,
    }),
    [referenceId]
  )

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>
}
