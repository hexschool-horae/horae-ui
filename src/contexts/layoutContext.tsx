import { createContext, ReactNode } from 'react'

interface LayoutContextType {
  scrollToSection: (sectionId: string) => void
}

export const LayoutContext = createContext<LayoutContextType>({} as LayoutContextType)

interface LayoutContextProviderProps {
  children?: ReactNode
}

const LayoutContextProvider = ({ children }: LayoutContextProviderProps) => {
  const scrollToSection = (sectionId: string) => {
    console.log('------', sectionId)
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return <LayoutContext.Provider value={{ scrollToSection }}>{children}</LayoutContext.Provider>
}

export default LayoutContextProvider
