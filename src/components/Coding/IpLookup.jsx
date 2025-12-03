import { useState } from 'react'
import './IpLookup.css'

const IpLookup = () => {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [myIp, setMyIp] = useState(null)

  // Query IP info using ip-api.com (free, no API key required)
  const queryIp = async (ipAddress) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // ip-api.com supports Chinese response
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?lang=zh-CN`)
      const data = await response.json()

      if (data.status === 'success') {
        setResult({
          ip: data.query,
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as
        })
      } else {
        setError(data.message || '查询失败，请检查 IP 地址格式')
      }
    } catch (err) {
      setError('网络请求失败，请稍后重试')
      console.error('IP lookup error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get current user's IP
  const getMyIp = async () => {
    setLoading(true)
    setError(null)

    try {
      // First get current IP, then query details
      const response = await fetch('http://ip-api.com/json/?lang=zh-CN')
      const data = await response.json()

      if (data.status === 'success') {
        setMyIp(data.query)
        setIp(data.query)
        setResult({
          ip: data.query,
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as
        })
      } else {
        setError('获取本机 IP 失败')
      }
    } catch (err) {
      setError('网络请求失败，请稍后重试')
      console.error('Get my IP error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ip.trim()) {
      queryIp(ip.trim())
    }
  }

  const handleClear = () => {
    setIp('')
    setResult(null)
    setError(null)
  }

  // Get country flag emoji from country code
  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '🌍'
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="ip-lookup">
      <div className="ip-lookup-header">
        <h3 className="title">🌐 IP 地址查询</h3>
        <span className="subtitle">查询 IP 地址归属地信息</span>
      </div>

      <div className="ip-lookup-content">
        {/* Input section */}
        <div className="ip-input-section">
          <form onSubmit={handleSubmit} className="ip-form">
            <input
              type="text"
              className="ip-input"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="输入 IP 地址，例如：8.8.8.8"
              disabled={loading}
            />
            <button type="submit" className="ip-btn query" disabled={loading || !ip.trim()}>
              {loading ? '查询中...' : '🔍 查询'}
            </button>
          </form>

          <div className="ip-actions">
            <button className="ip-btn my-ip" onClick={getMyIp} disabled={loading}>
              📍 查询本机 IP
            </button>
            <button className="ip-btn clear" onClick={handleClear} disabled={loading}>
              🗑️ 清空
            </button>
          </div>

          {myIp && (
            <div className="my-ip-badge">
              当前 IP：<strong>{myIp}</strong>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="ip-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="ip-loading">
            <div className="loading-spinner"></div>
            <span>正在查询...</span>
          </div>
        )}

        {/* Result section */}
        {result && !loading && (
          <div className="ip-result">
            <div className="result-header">
              <span className="country-flag">{getCountryFlag(result.countryCode)}</span>
              <span className="result-ip">{result.ip}</span>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <span className="label">🌍 国家/地区</span>
                <span className="value">{result.country || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">📍 省/州</span>
                <span className="value">{result.region || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">🏙️ 城市</span>
                <span className="value">{result.city || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">📮 邮编</span>
                <span className="value">{result.zip || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">🕐 时区</span>
                <span className="value">{result.timezone || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">📡 ISP</span>
                <span className="value">{result.isp || '-'}</span>
              </div>
              <div className="result-item full-width">
                <span className="label">🏢 组织</span>
                <span className="value">{result.org || '-'}</span>
              </div>
              <div className="result-item full-width">
                <span className="label">🔗 AS</span>
                <span className="value">{result.as || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">📐 纬度</span>
                <span className="value">{result.lat || '-'}</span>
              </div>
              <div className="result-item">
                <span className="label">📐 经度</span>
                <span className="value">{result.lon || '-'}</span>
              </div>
            </div>

            {result.lat && result.lon && (
              <div className="map-link">
                <a 
                  href={`https://uri.amap.com/marker?position=${result.lon},${result.lat}&name=IP位置`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-map-btn"
                >
                  🗺️ 在高德地图中查看
                </a>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        <div className="ip-examples">
          <span className="examples-title">常用示例：</span>
          <div className="examples-list">
            <button className="example-btn" onClick={() => { setIp('8.8.8.8'); queryIp('8.8.8.8') }}>
              8.8.8.8 (Google DNS)
            </button>
            <button className="example-btn" onClick={() => { setIp('1.1.1.1'); queryIp('1.1.1.1') }}>
              1.1.1.1 (Cloudflare)
            </button>
            <button className="example-btn" onClick={() => { setIp('114.114.114.114'); queryIp('114.114.114.114') }}>
              114.114.114.114 (国内 DNS)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IpLookup

