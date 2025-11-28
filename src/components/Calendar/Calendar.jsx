import { useState } from 'react'
import './Calendar.css'
import { getCalendarData, isHoliday, isWorkday } from '../../utils/calendarUtils'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const calendarData = getCalendarData(year, month)
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                      '七月', '八月', '九月', '十月', '十一月', '十二月']

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2 className="calendar-title">{year}年 {monthNames[month]}</h2>
        <div className="calendar-controls">
          <button onClick={prevMonth} className="calendar-btn">上一月</button>
          <button onClick={goToToday} className="calendar-btn today-btn">今天</button>
          <button onClick={nextMonth} className="calendar-btn">下一月</button>
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot holiday"></span>
          <span>法定节假日</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot workday"></span>
          <span>调休上班</span>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Week day headers */}
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarData.map((day, index) => {
          const dateStr = day.date ? `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.date).padStart(2, '0')}` : null
          const holiday = dateStr ? isHoliday(dateStr) : null
          const workday = dateStr ? isWorkday(dateStr) : null
          const isToday = day.isCurrentMonth && day.date === new Date().getDate() && 
                         month === new Date().getMonth() && year === new Date().getFullYear()
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} 
                         ${isToday ? 'today' : ''} 
                         ${holiday ? 'holiday' : ''} 
                         ${workday ? 'workday' : ''}`}
            >
              {day.date && (
                <>
                  <span className="day-number">{day.date}</span>
                  {day.lunarInfo && (
                    <span className="day-lunar">
                      {day.lunarInfo.displayText}
                    </span>
                  )}
                  {holiday && <span className="day-label holiday-label">{holiday}</span>}
                  {workday && <span className="day-label workday-label">班</span>}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar

