import { useState, useEffect, useRef } from 'react'
import './RegexTester.css'

const RegexTester = () => {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false })
  const [testText, setTestText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [replaced, setReplaced] = useState('')
  
  const testTextRef = useRef(null)

  // Common regex examples
  const examples = [
    { name: '📧 邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: { g: true, i: true } },
    { name: '📱 手机号', pattern: '1[3-9]\\d{9}', flags: { g: true } },
    { name: '🔗 URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: { g: true, i: true } },
    { name: '🆔 身份证', pattern: '[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]', flags: { g: true } },
    { name: '🔢 整数', pattern: '-?\\d+', flags: { g: true } },
    { name: '💯 小数', pattern: '-?\\d+\\.\\d+', flags: { g: true } },
    { name: '🎨 十六进制颜色', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', flags: { g: true, i: true } },
    { name: '📅 日期 YYYY-MM-DD', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])', flags: { g: true } },
    { name: '🕐 时间 HH:MM', pattern: '([01]?\\d|2[0-3]):[0-5]\\d', flags: { g: true } },
    { name: '🌐 IP地址', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', flags: { g: true } },
  ]

  // Test regex against text
  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([])
      setError('')
      setReplaced('')
      return
    }

    try {
      const flagsStr = Object.keys(flags).filter(f => flags[f]).join('')
      const regex = new RegExp(pattern, flagsStr)
      const matchesArray = []
      
      if (flags.g) {
        // Global flag: find all matches
        let match
        const regexCopy = new RegExp(pattern, flagsStr)
        while ((match = regexCopy.exec(testText)) !== null) {
          matchesArray.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            fullMatch: match
          })
          // Prevent infinite loop for zero-width matches
          if (match.index === regexCopy.lastIndex) {
            regexCopy.lastIndex++
          }
        }
      } else {
        // No global flag: find first match only
        const match = regex.exec(testText)
        if (match) {
          matchesArray.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            fullMatch: match
          })
        }
      }
      
      setMatches(matchesArray)
      setError('')

      // Handle replace
      if (showReplace && replaceText !== undefined) {
        try {
          const replacedText = testText.replace(regex, replaceText)
          setReplaced(replacedText)
        } catch (err) {
          setReplaced('')
        }
      }
    } catch (err) {
      setError(err.message)
      setMatches([])
      setReplaced('')
    }
  }, [pattern, flags, testText, replaceText, showReplace])

  const handleFlagToggle = (flag) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
  }

  const loadExample = (example) => {
    setPattern(example.pattern)
    setFlags({ g: false, i: false, m: false, s: false, u: false, ...example.flags })
  }

  const clearAll = () => {
    setPattern('')
    setTestText('')
    setReplaceText('')
    setFlags({ g: true, i: false, m: false, s: false, u: false })
    setMatches([])
    setError('')
    setReplaced('')
  }

  // Get line numbers for test text
  const getLineNumbers = (text) => {
    const lines = text.split('\n').length
    return Array.from({ length: lines }, (_, i) => i + 1)
  }

  // Highlight matches in text
  const getHighlightedText = () => {
    if (!testText || matches.length === 0) {
      return testText
    }

    const parts = []
    let lastIndex = 0

    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

    sortedMatches.forEach((match, idx) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          text: testText.substring(lastIndex, match.index),
          isMatch: false
        })
      }
      
      // Add match
      parts.push({
        text: match.text,
        isMatch: true,
        matchIndex: idx
      })
      
      lastIndex = match.index + match.text.length
    })

    // Add remaining text
    if (lastIndex < testText.length) {
      parts.push({
        text: testText.substring(lastIndex),
        isMatch: false
      })
    }

    return parts
  }

  const highlightedParts = getHighlightedText()

  return (
    <div className="regex-tester">
      <div className="regex-header">
        <h3 className="regex-title">正则表达式测试</h3>
        <button onClick={clearAll} className="regex-clear-btn">
          🗑️ 清空
        </button>
      </div>

      {/* Examples */}
      <div className="regex-examples">
        <div className="examples-label">常用示例：</div>
        <div className="examples-buttons">
          {examples.map((example, idx) => (
            <button
              key={idx}
              className="example-btn"
              onClick={() => loadExample(example)}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern input section */}
      <div className="regex-pattern-section">
        <div className="pattern-input-group">
          <span className="pattern-delimiter">/</span>
          <input
            type="text"
            className="pattern-input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式，例如：\d+"
          />
          <span className="pattern-delimiter">/</span>
          <div className="flags-group">
            {Object.keys(flags).map(flag => (
              <button
                key={flag}
                className={`flag-btn ${flags[flag] ? 'active' : ''}`}
                onClick={() => handleFlagToggle(flag)}
                title={getFlagTitle(flag)}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="regex-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {!error && matches.length > 0 && (
          <div className="regex-success">
            <span className="success-icon">✓</span>
            <span className="success-text">
              找到 {matches.length} 个匹配
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="regex-content">
        {/* Test text input */}
        <div className="regex-section">
          <div className="section-header">
            <h4 className="section-title">测试文本</h4>
            <span className="section-info">
              {testText.length} 字符
            </span>
          </div>
          <div className="textarea-with-lines">
            <div className="line-numbers">
              {getLineNumbers(testText).map(num => (
                <div key={num} className="line-number">{num}</div>
              ))}
            </div>
            <textarea
              ref={testTextRef}
              className="regex-textarea"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="在此输入要测试的文本..."
            />
          </div>
        </div>

        {/* Match results */}
        <div className="regex-section">
          <div className="section-header">
            <h4 className="section-title">匹配结果</h4>
            <div className="section-actions">
              <button
                className={`toggle-replace-btn ${showReplace ? 'active' : ''}`}
                onClick={() => setShowReplace(!showReplace)}
              >
                {showReplace ? '隐藏替换' : '显示替换'}
              </button>
            </div>
          </div>
          
          {testText && (
            <div className="highlighted-text">
              {Array.isArray(highlightedParts) ? (
                highlightedParts.map((part, idx) => (
                  part.isMatch ? (
                    <mark key={idx} className="match-highlight" title={`匹配 ${part.matchIndex + 1}`}>
                      {part.text}
                    </mark>
                  ) : (
                    <span key={idx}>{part.text}</span>
                  )
                ))
              ) : (
                <span>{highlightedParts}</span>
              )}
            </div>
          )}

          {matches.length > 0 && (
            <div className="matches-list">
              {matches.map((match, idx) => (
                <div key={idx} className="match-item">
                  <div className="match-index">#{idx + 1}</div>
                  <div className="match-details">
                    <div className="match-text">
                      <strong>匹配:</strong> <code>{match.text}</code>
                    </div>
                    <div className="match-position">
                      <strong>位置:</strong> {match.index} - {match.index + match.text.length - 1}
                    </div>
                    {match.groups.length > 0 && (
                      <div className="match-groups">
                        <strong>捕获组:</strong>
                        {match.groups.map((group, gIdx) => (
                          group !== undefined && (
                            <span key={gIdx} className="capture-group">
                              ${gIdx + 1}: <code>{group}</code>
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Replace section */}
      {showReplace && (
        <div className="replace-section">
          <div className="replace-input-group">
            <label className="replace-label">替换为:</label>
            <input
              type="text"
              className="replace-input"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="输入替换文本，支持 $1, $2 等捕获组引用"
            />
          </div>
          {replaced && (
            <div className="replace-result">
              <div className="section-header">
                <h4 className="section-title">替换结果</h4>
                <button
                  className="copy-result-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(replaced)
                    const btn = document.querySelector('.copy-result-btn')
                    const originalText = btn.textContent
                    btn.textContent = '✓ 已复制'
                    setTimeout(() => {
                      btn.textContent = originalText
                    }, 1500)
                  }}
                >
                  📋 复制
                </button>
              </div>
              <div className="replace-output">
                {replaced}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function for flag titles
function getFlagTitle(flag) {
  const titles = {
    g: 'global - 全局匹配',
    i: 'ignoreCase - 忽略大小写',
    m: 'multiline - 多行模式',
    s: 'dotAll - . 匹配换行符',
    u: 'unicode - Unicode模式'
  }
  return titles[flag] || flag
}

export default RegexTester

