import { useState, useRef, useEffect } from 'react'
import { HOT_CITIES, CITIES, searchCities } from '../../utils/cityData'
import './CitySelector.css'

const CitySelector = ({ value, onChange, onSearch }) => {
  const [inputValue, setInputValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCities, setFilteredCities] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showAllCities, setShowAllCities] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const query = e.target.value
    setInputValue(query)
    onChange(query)

    // Search cities
    if (query.trim()) {
      const results = searchCities(query)
      setFilteredCities(results)
      setShowAllCities(false)
      setIsOpen(results.length > 0)
      setSelectedIndex(-1)
    } else {
      setFilteredCities([])
      setShowAllCities(false)
      setIsOpen(false)
    }
  }

  const handleInputFocus = () => {
    // Show hot cities when input is empty, all cities when has input
    if (!inputValue.trim()) {
      setFilteredCities(HOT_CITIES)
      setShowAllCities(false)
      setIsOpen(true)
    } else {
      // If has input, search cities
      const results = searchCities(inputValue)
      setFilteredCities(results)
      setShowAllCities(false)
      setIsOpen(results.length > 0)
    }
  }

  const handleDropdownToggle = () => {
    if (isOpen && showAllCities) {
      setIsOpen(false)
      setShowAllCities(false)
    } else {
      setFilteredCities(CITIES)
      setShowAllCities(true)
      setIsOpen(true)
      setSelectedIndex(-1)
    }
  }

  const handleCitySelect = (city) => {
    setInputValue(city.name)
    onChange(city.name)
    setIsOpen(false)
    onSearch(city.name)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        onSearch(inputValue)
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && filteredCities[selectedIndex]) {
          handleCitySelect(filteredCities[selectedIndex])
        } else {
          onSearch(inputValue)
          setIsOpen(false)
          inputRef.current?.blur()
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
      default:
        break
    }
  }

  const handleBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      // Only search if input is not empty and different from current value
      if (inputValue.trim() && inputValue !== value) {
        onSearch(inputValue)
      }
    }, 200)
  }

  // Check if we should show hot cities section
  const showHotCities = isOpen && !showAllCities && !inputValue.trim()
  const showSearchResults = isOpen && !showAllCities && inputValue.trim() && filteredCities.length > 0
  const showAllCitiesList = isOpen && showAllCities

  return (
    <div className="city-selector" ref={containerRef}>
      <label htmlFor="city-input">📍</label>
      <input
        ref={inputRef}
        id="city-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="搜索城市（拼音/汉字）"
        autoComplete="off"
      />
      <button
        className="dropdown-button"
        onClick={handleDropdownToggle}
        onMouseDown={(e) => e.preventDefault()} // Prevent input blur
        title="显示所有城市"
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
          <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {(showHotCities || showSearchResults || showAllCitiesList) && (
        <div className="city-dropdown">
          {/* Always show hot cities when not in "all cities" mode */}
          {(showHotCities || showSearchResults) && (
            <div className="city-section">
              <div className="city-section-title">热门城市</div>
              <div className="city-list">
                {HOT_CITIES.map((city) => (
                  <div
                    key={`hot-${city.id}`}
                    className="city-item"
                    onClick={() => handleCitySelect(city)}
                  >
                    <span className="city-name">{city.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSearchResults && (
            <div className="city-section">
              <div className="city-section-title">
                搜索结果 ({filteredCities.length})
              </div>
              <div className="city-list">
                {filteredCities.map((city, index) => (
                  <div
                    key={city.id}
                    className={`city-item ${selectedIndex === index ? 'selected' : ''}`}
                    onClick={() => handleCitySelect(city)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="city-name">{city.name}</span>
                    <span className="city-pinyin">{city.pinyin}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAllCitiesList && (
            <>
              <div className="city-section">
                <div className="city-section-title">热门城市</div>
                <div className="city-list">
                  {HOT_CITIES.map((city) => (
                    <div
                      key={`hot-${city.id}`}
                      className="city-item"
                      onClick={() => handleCitySelect(city)}
                    >
                      <span className="city-name">{city.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="city-section">
                <div className="city-section-title">所有城市 ({CITIES.length})</div>
                <div className="city-list">
                  {filteredCities.map((city, index) => (
                    <div
                      key={city.id}
                      className={`city-item ${selectedIndex === index ? 'selected' : ''}`}
                      onClick={() => handleCitySelect(city)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="city-name">{city.name}</span>
                      <span className="city-pinyin">{city.pinyin}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CitySelector

