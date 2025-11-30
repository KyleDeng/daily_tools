import { useState, useRef, useEffect } from 'react'
import './ShellTranslate.css'

const ShellTranslate = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 你好！我可以帮你将自然语言指令翻译成Shell命令。\n\n例如：\n- "列出当前目录下的所有文件"\n- "查找包含hello的文件"\n- "删除所有.log文件"',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // ⚠️ 警告：Token 暴露在前端是不安全的！
  // 生产环境请使用后端服务
  const COZE_API_TOKEN = 'sat_a9qfw2z8oKefxAMhzP7tqqwt3sOWhEnm6nu1a4rfZo7QyUnL53wPUkqMeVXPTK3S'
  const COZE_API_BASE = 'https://api.coze.cn'
  const BOT_ID = '7559896783309602851'
  const USER_ID = 'huatuoai'

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 直接调用 Coze API（不安全！）
      const response = await fetch(`${COZE_API_BASE}/v1/conversation/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COZE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_id: BOT_ID,
          user_id: USER_ID,
          stream: true,
          additional_messages: [{
            role: 'user',
            content: input.trim(),
            content_type: 'text'
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.event === 'conversation.message.delta' && parsed.message?.content) {
                assistantMessage.content += parsed.message.content
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = { ...assistantMessage }
                  return newMessages
                })
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ 调用失败: ${error.message}\n\n可能的原因：\n1. API Token 无效\n2. 网络连接问题\n3. CORS 跨域限制\n\n建议使用后端服务方案。`,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // ... 其余代码与原版相同
  // (handleKeyPress, handleCopy, handleClear, formatTime, renderContent 等)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (content) => {
    const codeMatch = content.match(/```(?:bash|shell)?\n([\s\S]*?)```/)
    const textToCopy = codeMatch ? codeMatch[1].trim() : content
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const btn = event.target
      const originalText = btn.textContent
      btn.textContent = '✓ 已复制'
      setTimeout(() => {
        btn.textContent = originalText
      }, 1500)
    })
  }

  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 你好！我可以帮你将自然语言指令翻译成Shell命令。',
      timestamp: new Date()
    }])
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const renderContent = (content) => {
    const parts = []
    const codeBlockRegex = /```(?:bash|shell)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) })
      }
      parts.push({ type: 'code', content: match[1].trim() })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.substring(lastIndex) })
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content })
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="code-block">
            <div className="code-header">
              <span className="code-label">Shell命令</span>
              <button className="code-copy-btn" onClick={() => handleCopy(part.content)}>
                📋 复制
              </button>
            </div>
            <pre className="code-content">
              <code>{part.content}</code>
            </pre>
          </div>
        )
      } else {
        return (
          <div key={idx} className="text-content">
            {part.content.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
        )
      }
    })
  }

  return (
    <div className="shell-translate">
      {/* 安全警告 */}
      <div className="security-warning" style={{
        background: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem',
        fontSize: '0.9rem'
      }}>
        <strong>⚠️ 警告：</strong> 当前使用纯前端方案，API Token 暴露在浏览器中，存在安全风险！
        <br/>建议在生产环境使用后端服务方案。
      </div>

      <div className="chat-header">
        <div className="header-title">
          <h3 className="title">🔧 命令翻译助手</h3>
          <span className="subtitle">由 Coze AI 驱动（纯前端模式）</span>
        </div>
        <button onClick={handleClear} className="clear-chat-btn">
          🗑️ 清空对话
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">
                  {message.role === 'user' ? '你' : 'AI助手'}
                </span>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="message-body">
                {renderContent(message.content)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">AI助手</span>
              </div>
              <div className="message-body">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述你想执行的操作，例如：列出当前目录下的所有文件..."
            disabled={isLoading}
            rows={1}
          />
          <button 
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        <div className="input-hint">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  )
}

export default ShellTranslate

