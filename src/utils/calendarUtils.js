// Calendar utility functions and holiday data
import { Solar } from 'lunar-javascript'

// 2024-2025 Chinese holidays and adjusted workdays
// Data source: Chinese government announcements
const holidays = {
  // 2024
  '2024-01-01': '元旦',
  '2024-02-10': '春节',
  '2024-02-11': '春节',
  '2024-02-12': '春节',
  '2024-02-13': '春节',
  '2024-02-14': '春节',
  '2024-02-15': '春节',
  '2024-02-16': '春节',
  '2024-02-17': '春节',
  '2024-04-04': '清明节',
  '2024-04-05': '清明节',
  '2024-04-06': '清明节',
  '2024-05-01': '劳动节',
  '2024-05-02': '劳动节',
  '2024-05-03': '劳动节',
  '2024-05-04': '劳动节',
  '2024-05-05': '劳动节',
  '2024-06-10': '端午节',
  '2024-09-15': '中秋节',
  '2024-09-16': '中秋节',
  '2024-09-17': '中秋节',
  '2024-10-01': '国庆节',
  '2024-10-02': '国庆节',
  '2024-10-03': '国庆节',
  '2024-10-04': '国庆节',
  '2024-10-05': '国庆节',
  '2024-10-06': '国庆节',
  '2024-10-07': '国庆节',
  
  // 2025
  '2025-01-01': '元旦',
  '2025-01-28': '春节',
  '2025-01-29': '春节',
  '2025-01-30': '春节',
  '2025-01-31': '春节',
  '2025-02-01': '春节',
  '2025-02-02': '春节',
  '2025-02-03': '春节',
  '2025-02-04': '春节',
  '2025-04-04': '清明节',
  '2025-04-05': '清明节',
  '2025-04-06': '清明节',
  '2025-05-01': '劳动节',
  '2025-05-02': '劳动节',
  '2025-05-03': '劳动节',
  '2025-05-04': '劳动节',
  '2025-05-05': '劳动节',
  '2025-05-31': '端午节',
  '2025-06-01': '端午节',
  '2025-06-02': '端午节',
  '2025-10-01': '国庆节',
  '2025-10-02': '国庆节',
  '2025-10-03': '国庆节',
  '2025-10-04': '国庆节',
  '2025-10-05': '国庆节',
  '2025-10-06': '国庆节',
  '2025-10-07': '国庆节',
  '2025-10-08': '国庆节',
}

// Adjusted workdays (补班日)
const workdays = [
  // 2024
  '2024-02-04', // 春节调休
  '2024-02-18', // 春节调休
  '2024-04-07', // 清明节调休
  '2024-04-28', // 劳动节调休
  '2024-05-11', // 劳动节调休
  '2024-09-14', // 中秋节调休
  '2024-09-29', // 国庆节调休
  '2024-10-12', // 国庆节调休
  
  // 2025
  '2025-01-26', // 春节调休
  '2025-02-08', // 春节调休
  '2025-04-27', // 劳动节调休
  '2025-09-28', // 国庆节调休
  '2025-10-11', // 国庆节调休
]

/**
 * Check if a date is a holiday
 * @param {string} dateStr - Date string in format 'YYYY-MM-DD'
 * @returns {string|null} Holiday name or null
 */
export const isHoliday = (dateStr) => {
  return holidays[dateStr] || null
}

/**
 * Check if a date is an adjusted workday
 * @param {string} dateStr - Date string in format 'YYYY-MM-DD'
 * @returns {boolean}
 */
export const isWorkday = (dateStr) => {
  return workdays.includes(dateStr)
}

/**
 * Get lunar date information
 * @param {number} year - Year
 * @param {number} month - Month (1-12, not 0-11)
 * @param {number} day - Day
 * @returns {Object} Lunar date information
 */
export const getLunarInfo = (year, month, day) => {
  try {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()
    
    // Get lunar day in Chinese
    const lunarDay = lunar.getDayInChinese()
    
    // Get lunar festivals
    const festivals = lunar.getFestivals()
    
    // Get solar term (节气)
    const jieQi = lunar.getJieQi()
    
    // Prioritize display: solar term > festival > lunar day
    let displayText = lunarDay
    if (festivals.length > 0) {
      displayText = festivals[0]
    }
    if (jieQi) {
      displayText = jieQi
    }
    
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      monthInChinese: lunar.getMonthInChinese(),
      dayInChinese: lunarDay,
      festivals,
      jieQi,
      displayText
    }
  } catch (error) {
    console.error('Error getting lunar info:', error)
    return null
  }
}

/**
 * Get calendar data for a given month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Array} Array of calendar day objects
 */
export const getCalendarData = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const daysInPrevMonth = prevLastDay.getDate()
  
  const calendarData = []
  
  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const day = daysInPrevMonth - i
    
    calendarData.push({
      date: day,
      isCurrentMonth: false,
      year: prevYear,
      month: prevMonth + 1, // lunar-javascript uses 1-12
      lunarInfo: getLunarInfo(prevYear, prevMonth + 1, day)
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarData.push({
      date: i,
      isCurrentMonth: true,
      year: year,
      month: month + 1, // lunar-javascript uses 1-12
      lunarInfo: getLunarInfo(year, month + 1, i)
    })
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendarData.length // 6 rows * 7 days
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  
  for (let i = 1; i <= remainingDays; i++) {
    calendarData.push({
      date: i,
      isCurrentMonth: false,
      year: nextYear,
      month: nextMonth + 1, // lunar-javascript uses 1-12
      lunarInfo: getLunarInfo(nextYear, nextMonth + 1, i)
    })
  }
  
  return calendarData
}

