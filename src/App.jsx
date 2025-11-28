import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Weather from './components/Weather/Weather'
import Calendar from './components/Calendar/Calendar'

function App() {
  const [activeTab, setActiveTab] = useState('weather')

  // Render active tool component
  const renderToolContent = () => {
    switch (activeTab) {
      case 'weather':
        return <Weather />
      case 'calendar':
        return <Calendar />
      default:
        return <Weather />
    }
  }

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="content">
        {renderToolContent()}
      </main>
    </div>
  )
}

export default App

