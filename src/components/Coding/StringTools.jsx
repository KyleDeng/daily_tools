import { useState, useRef } from 'react'
import './StringTools.css'

const StringTools = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const inputLineNumbersRef = useRef(null)
  const outputLineNumbersRef = useRef(null)

  const operations = [
    { id: 'uppercase', label: '转大写', icon: '🔠', fn: (str) => str.toUpperCase() },
    { id: 'lowercase', label: '转小写', icon: '🔡', fn: (str) => str.toLowerCase() },
    { id: 'capitalize', label: '首字母大写', icon: '🔤', fn: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() },
    { id: 'reverse', label: '反转', icon: '🔄', fn: (str) => str.split('').reverse().join('') },
    { id: 'trim', label: '去除空格', icon: '✂️', fn: (str) => str.trim() },
    { id: 'removeSpaces', label: '删除所有空格', icon: '🚫', fn: (str) => str.replace(/\s/g, '') },
    { id: 'base64Encode', label: 'Base64编码', icon: '🔐', fn: (str) => btoa(unescape(encodeURIComponent(str))) },
    { id: 'base64Decode', label: 'Base64解码', icon: '🔓', fn: (str) => {
      try {
        return decodeURIComponent(escape(atob(str)))
      } catch {
        return '解码失败：输入不是有效的Base64'
      }
    }},
    { id: 'urlEncode', label: 'URL编码', icon: '🌐', fn: (str) => encodeURIComponent(str) },
    { id: 'urlDecode', label: 'URL解码', icon: '🗺️', fn: (str) => {
      try {
        return decodeURIComponent(str)
      } catch {
        return '解码失败：输入不是有效的URL编码'
      }
    }},
    { id: 'wordCount', label: '统计字数', icon: '📊', fn: (str) => `字符数: ${str.length}\n单词数: ${str.trim().split(/\s+/).filter(w => w).length}\n行数: ${str.split('\n').length}` },
    { id: 'escapeHtml', label: 'HTML转义', icon: '🏷️', fn: (str) => str.replace(/[&<>"']/g, (match) => {
      const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }
      return escapeMap[match]
    })}
  ]

  const handleOperation = (operation) => {
    if (!input.trim()) {
      setOutput('请先输入文本')
      return
    }
    const result = operation.fn(input)
    setOutput(result)
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      // Show a brief feedback
      const btn = document.querySelector('.copy-btn')
      const originalText = btn.textContent
      btn.textContent = '✓ 已复制'
      setTimeout(() => {
        btn.textContent = originalText
      }, 1500)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  const getLineNumbers = (text) => {
    const lines = text.split('\n').length
    return Array.from({ length: lines }, (_, i) => i + 1)
  }

  const handleInputScroll = (e) => {
    if (inputLineNumbersRef.current) {
      inputLineNumbersRef.current.scrollTop = e.target.scrollTop
    }
  }

  const handleOutputScroll = (e) => {
    if (outputLineNumbersRef.current) {
      outputLineNumbersRef.current.scrollTop = e.target.scrollTop
    }
  }

  return (
    <div className="string-tools">
      <div className="string-tools-layout">
        <div className="string-section">
          <div className="section-header">
            <h3 className="section-title">输入文本</h3>
            <button onClick={handleClear} className="clear-btn">清空</button>
          </div>
          <div className="textarea-with-lines">
            <div className="line-numbers" ref={inputLineNumbersRef}>
              {getLineNumbers(input).map(num => (
                <div key={num} className="line-number">{num}</div>
              ))}
            </div>
            <textarea
              className="string-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onScroll={handleInputScroll}
              placeholder="请输入要处理的文本..."
            />
          </div>
        </div>

        <div className="string-operations">
          {operations.map(op => (
            <button
              key={op.id}
              className="operation-btn"
              onClick={() => handleOperation(op)}
            >
              <span className="op-icon">{op.icon}</span>
              <span className="op-label">{op.label}</span>
            </button>
          ))}
        </div>

        <div className="string-section">
          <div className="section-header">
            <h3 className="section-title">输出结果</h3>
            <button onClick={handleCopy} className="copy-btn" disabled={!output}>
              📋 复制
            </button>
          </div>
          <div className="textarea-with-lines">
            <div className="line-numbers" ref={outputLineNumbersRef}>
              {getLineNumbers(output).map(num => (
                <div key={num} className="line-number">{num}</div>
              ))}
            </div>
            <textarea
              className="string-output"
              value={output}
              onScroll={handleOutputScroll}
              readOnly
              placeholder="处理结果将显示在这里..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StringTools


