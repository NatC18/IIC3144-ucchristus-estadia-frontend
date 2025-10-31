import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface SearchableSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  label,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true
    const lowerSearch = searchTerm.toLowerCase()
    const lowerOption = option.toLowerCase()
    // Split the search term into words and check if all words are contained as complete words
    const searchWords = lowerSearch.split(/\s+/).filter(w => w.length > 0)
    return searchWords.every(word => 
      lowerOption.includes(word)
    )
  })

  const selectedLabel = value ? options.find((opt) => opt === value) : null

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-left flex items-center justify-between bg-white"
        >
          <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-purple-50 transition-colors ${
                      value === option ? 'bg-purple-100 text-[#671E75] font-medium' : 'text-gray-900'
                    }`}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
