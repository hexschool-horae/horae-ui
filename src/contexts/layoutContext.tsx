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
      const sectionTop = section.offsetTop
      const scrollOffset = -60 // 往下滾動的偏移量

      window.scrollTo({
        top: sectionTop + scrollOffset,
        behavior: 'smooth',
      })
    }
  }

  return <LayoutContext.Provider value={{ scrollToSection }}>{children}</LayoutContext.Provider>
}

export default LayoutContextProvider
