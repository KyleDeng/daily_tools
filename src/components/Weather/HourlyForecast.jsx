import { useMemo } from 'react'
import './HourlyForecast.css'

const HourlyForecast = ({ hourlyData }) => {
  // Calculate chart dimensions and scales
  const chartMetrics = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return null

    const temps = hourlyData.map(h => h.temperature)
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...temps)
    const tempRange = maxTemp - minTemp || 10

    // SVG dimensions - wider to accommodate all hours with 1-hour intervals
    const hourWidth = 60 // Width for each hour (increased for better visibility)
    const width = hourWidth * hourlyData.length + 120 // Total width based on data points
    const height = 280
    const padding = { top: 40, right: 60, bottom: 60, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Calculate points for temperature curve (left Y axis)
    const tempPoints = hourlyData.map((hour, index) => {
      const x = padding.left + (index / (hourlyData.length - 1)) * chartWidth
      const y = padding.top + ((maxTemp - hour.temperature) / tempRange) * chartHeight
      return { x, y, value: hour.temperature, time: hour.displayTime }
    })

    // Calculate points for rain probability curve (right Y axis, 0-100%)
    const rainPoints = hourlyData.map((hour, index) => {
      const x = padding.left + (index / (hourlyData.length - 1)) * chartWidth
      const y = padding.top + ((100 - hour.rainProbability) / 100) * chartHeight
      return { x, y, value: hour.rainProbability, time: hour.displayTime }
    })

    // Create smooth path helper function
    const createSmoothPath = (points) => {
      return points.map((point, index) => {
        if (index === 0) {
          return `M ${point.x},${point.y}`
        }
        const prevPoint = points[index - 1]
        const midX = (prevPoint.x + point.x) / 2
        return `Q ${midX},${prevPoint.y} ${midX},${(prevPoint.y + point.y) / 2} Q ${midX},${point.y} ${point.x},${point.y}`
      }).join(' ')
    }

    const tempPath = createSmoothPath(tempPoints)
    const rainPath = createSmoothPath(rainPoints)

    // Create gradient area path for rain
    const rainAreaPath = `${rainPath} L ${rainPoints[rainPoints.length - 1].x},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`

    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      maxTemp,
      minTemp,
      tempRange,
      tempPoints,
      rainPoints,
      tempPath,
      rainPath,
      rainAreaPath
    }
  }, [hourlyData])

  if (!chartMetrics || !hourlyData) {
    return <div>Loading...</div>
  }

  // Show every hour for labels (changed from 3 to 1 for better readability)
  const showLabelInterval = 1

  return (
    <div className="hourly-forecast">
      <h3 className="hourly-title">未来48小时预报</h3>
      
      <div className="hourly-chart-container">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-line temp-line"></div>
            <span>🌡️ 温度</span>
          </div>
          <div className="legend-item">
            <div className="legend-line rain-line"></div>
            <span>🌧️ 降雨概率</span>
          </div>
        </div>

        <div className="chart-wrapper">
          <svg 
            className="combined-chart" 
            width={chartMetrics.width}
            height={chartMetrics.height}
            viewBox={`0 0 ${chartMetrics.width} ${chartMetrics.height}`}
            preserveAspectRatio="none"
          >
          <defs>
            {/* Temperature gradient */}
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3498db" />
              <stop offset="50%" stopColor="#e74c3c" />
              <stop offset="100%" stopColor="#f39c12" />
            </linearGradient>
            {/* Rain area gradient */}
            <linearGradient id="rainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(52, 152, 219, 0.2)" />
              <stop offset="100%" stopColor="rgba(52, 152, 219, 0.05)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g className="grid">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartMetrics.padding.top + ratio * chartMetrics.chartHeight
              return (
                <line
                  key={i}
                  x1={chartMetrics.padding.left}
                  y1={y}
                  x2={chartMetrics.padding.left + chartMetrics.chartWidth}
                  y2={y}
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="1"
                />
              )
            })}
          </g>

          {/* Rain probability area (behind temperature) */}
          <path
            d={chartMetrics.rainAreaPath}
            fill="url(#rainGradient)"
          />

          {/* Rain probability curve */}
          <path
            d={chartMetrics.rainPath}
            fill="none"
            stroke="#3498db"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5,5"
          />

          {/* Temperature curve */}
          <path
            d={chartMetrics.tempPath}
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Y-axis labels (Temperature) */}
          <g className="y-axis-left">
            {[0, 0.5, 1].map((ratio, i) => {
              const y = chartMetrics.padding.top + ratio * chartMetrics.chartHeight
              const temp = Math.round(chartMetrics.maxTemp - ratio * chartMetrics.tempRange)
              return (
                <text
                  key={i}
                  x={chartMetrics.padding.left - 10}
                  y={y}
                  textAnchor="end"
                  fontSize="11"
                  fill="#e74c3c"
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {temp}°
                </text>
              )
            })}
            <text
              x={20}
              y={chartMetrics.padding.top - 15}
              fontSize="12"
              fill="#e74c3c"
              fontWeight="600"
            >
              温度(°C)
            </text>
          </g>

          {/* Right Y-axis labels (Rain Probability) */}
          <g className="y-axis-right">
            {[0, 0.5, 1].map((ratio, i) => {
              const y = chartMetrics.padding.top + ratio * chartMetrics.chartHeight
              const rain = Math.round(100 - ratio * 100)
              return (
                <text
                  key={i}
                  x={chartMetrics.width - chartMetrics.padding.right + 10}
                  y={y}
                  textAnchor="start"
                  fontSize="11"
                  fill="#3498db"
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {rain}%
                </text>
              )
            })}
            <text
              x={chartMetrics.width - 50}
              y={chartMetrics.padding.top - 15}
              fontSize="12"
              fill="#3498db"
              fontWeight="600"
            >
              降雨(%)
            </text>
          </g>

          {/* Temperature points - show all points */}
          {chartMetrics.tempPoints.map((point, index) => {
            const showLabel = index % showLabelInterval === 0
            return (
              <g key={`temp-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="white"
                  stroke="#e74c3c"
                  strokeWidth="2"
                />
                {showLabel && (
                  <text
                    x={point.x}
                    y={point.y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#e74c3c"
                  >
                    {point.value}°
                  </text>
                )}
              </g>
            )
          })}

          {/* Rain probability points - show all points */}
          {chartMetrics.rainPoints.map((point, index) => {
            const showLabel = index % showLabelInterval === 0
            return (
              <g key={`rain-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="white"
                  stroke="#3498db"
                  strokeWidth="2"
                />
                {showLabel && point.value > 10 && (
                  <text
                    x={point.x}
                    y={point.y + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#3498db"
                  >
                    {point.value}%
                  </text>
                )}
              </g>
            )
          })}

          {/* X-axis time labels - show every hour */}
          {hourlyData.map((hour, index) => {
            const showLabel = index % showLabelInterval === 0
            if (!showLabel) return null
            const point = chartMetrics.tempPoints[index]
            return (
              <text
                key={`time-${index}`}
                x={point.x}
                y={chartMetrics.height - chartMetrics.padding.bottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#666"
                fontWeight="500"
              >
                {hour.displayTime}
              </text>
            )
          })}

          {/* Vertical lines for each hour */}
          {chartMetrics.tempPoints.map((point, index) => {
            // Show vertical line every 6 hours for visual separation
            if (index % 6 !== 0) return null
            return (
              <line
                key={`vline-${index}`}
                x1={point.x}
                y1={chartMetrics.padding.top}
                x2={point.x}
                y2={chartMetrics.padding.top + chartMetrics.chartHeight}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )
          })}
        </svg>
        </div>
      </div>
    </div>
  )
}

export default HourlyForecast

