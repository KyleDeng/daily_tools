import { useState, useRef, useEffect } from 'react'
import { CozeAPI, ChatEventType } from '@coze/api'
import './ShellTranslate.css'

const ShellTranslate = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 你好！我可以帮你：\n\n**1️⃣ 自然语言 → Shell命令**\n例如：\n- "列出当前目录下的所有文件"\n- "查找包含hello的文件"\n- "删除所有.log文件"\n\n**2️⃣ Linux命令 → PowerShell命令**\n例如：\n- 输入：`ls -la`\n- 输出：`Get-ChildItem -Force`\n\n直接输入你的需求或命令吧！',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [configError, setConfigError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // 从环境变量读取配置（不使用默认值）
  const COZE_TOKEN = import.meta.env.VITE_COZE_API_TOKEN
  const BOT_ID = import.meta.env.VITE_COZE_BOT_ID
  const USER_ID = import.meta.env.VITE_COZE_USER_ID
  const BASE_URL = import.meta.env.VITE_COZE_BASE_URL

  // 检查配置
  useEffect(() => {
    const missingConfigs = []
    if (!COZE_TOKEN) missingConfigs.push('VITE_COZE_API_TOKEN')
    if (!BOT_ID) missingConfigs.push('VITE_COZE_BOT_ID')
    if (!USER_ID) missingConfigs.push('VITE_COZE_USER_ID')
    if (!BASE_URL) missingConfigs.push('VITE_COZE_BASE_URL')
    
    if (missingConfigs.length > 0) {
      setConfigError(`未配置以下环境变量：${missingConfigs.join(', ')}`)
    }
  }, [COZE_TOKEN, BOT_ID, USER_ID, BASE_URL])

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

    // 检查配置
    if (configError) {
      alert(configError + '\n\n请查看 README.md 了解如何配置。')
      return
    }

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const userInput = input.trim()
    setInput('')
    setIsLoading(true)

    // 创建 AI 消息（带 loading 标志）
    const assistantMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }

    // 同时添加用户消息和 AI 消息
    setMessages(prev => [...prev, userMessage, assistantMessage])

    try {
      // 初始化 Coze API 客户端
      const apiClient = new CozeAPI({
        token: COZE_TOKEN,
        baseURL: BASE_URL
      })

      // 调用 Coze API 流式接口
      const stream = await apiClient.chat.stream({
        bot_id: BOT_ID,
        user_id: USER_ID,
        additional_messages: [{
          content: userInput,
          role: 'user',
          type: 'question'
        }]
      })

      // 处理流式响应
      for await (const event of stream) {
        if (event.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          // 消息增量更新 - 数据在 event.data 中
          if (event.data?.content) {
            assistantMessage.content += event.data.content
            // 更新最后一条消息，保持 isLoading 为 true
            setMessages(prev => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1] = { 
                ...assistantMessage,
                isLoading: true  // 继续显示加载状态
              }
              return newMessages
            })
          }
        } else if (event.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
          // 对话完成 - 移除 loading 标志
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = { 
              ...assistantMessage,
              isLoading: false  // 完成，移除加载状态
            }
            return newMessages
          })
          console.log('对话完成')
          break
        } else if (event.event === ChatEventType.CONVERSATION_CHAT_FAILED) {
          // 对话失败
          assistantMessage.content = `❌ 对话失败: ${event.data?.last_error?.msg || '未知错误'}`
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = { 
              ...assistantMessage,
              isLoading: false
            }
            return newMessages
          })
          break
        }
      }
    } catch (error) {
      console.error('Error:', error)
      // 更新最后一条消息为错误信息
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: `❌ 调用失败: ${error.message}\n\n可能的原因：\n1. Token 未配置或无效\n2. 网络连接问题\n3. Bot ID 不正确\n\n请检查 .env.local 文件中的配置。`,
          timestamp: new Date(),
          isLoading: false
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Copy command to clipboard
  const handleCopy = (content) => {
    // Extract command from markdown code block if exists
    const codeMatch = content.match(/```(?:bash|shell)?\n([\s\S]*?)```/)
    const textToCopy = codeMatch ? codeMatch[1].trim() : content
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Show feedback
      const btn = event.target
      const originalText = btn.textContent
      btn.textContent = '✓ 已复制'
      setTimeout(() => {
        btn.textContent = originalText
      }, 1500)
    })
  }

  // Clear chat
  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 你好！我可以帮你：\n\n**1️⃣ 自然语言 → Shell命令**\n例如：\n- "列出当前目录下的所有文件"\n- "查找包含hello的文件"\n- "删除所有.log文件"\n\n**2️⃣ Linux命令 → PowerShell命令**\n例如：\n- 输入：`ls -la`\n- 输出：`Get-ChildItem -Force`\n\n直接输入你的需求或命令吧！',
      timestamp: new Date()
    }])
  }

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // Render message content with markdown-like formatting
  const renderContent = (content) => {
    // Simple markdown code block rendering
    const parts = []
    const codeBlockRegex = /```(?:bash|shell|powershell)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        })
      }
      
      // Add code block
      parts.push({
        type: 'code',
        content: match[1].trim()
      })
      
      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      })
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
              <button 
                className="code-copy-btn"
                onClick={() => handleCopy(part.content)}
              >
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
            {part.content.split('\n').map((line, i) => {
              // 支持简单的markdown格式
              let formattedLine = line
              
              // 加粗 **text**
              formattedLine = formattedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              
              // 行内代码 `text`
              formattedLine = formattedLine.replace(/`(.+?)`/g, '<code class="inline-code">$1</code>')
              
              return (
                <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} />
              )
            })}
          </div>
        )
      }
    })
  }

  return (
    <div className="shell-translate">
      {/* 配置错误提示 */}
      {configError && (
        <div className="config-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <strong>配置错误：</strong>{configError}
            <div className="error-hint">
              请创建 <code>.env.local</code> 文件，并添加：
              <pre>VITE_COZE_API_TOKEN=your_token_here</pre>
            </div>
          </div>
        </div>
      )}

      <div className="chat-header">
        <div className="header-title">
          <h3 className="title">🔧 命令翻译助手</h3>
          <span className="subtitle">由 Coze AI 驱动 · 纯前端方案</span>
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
                {message.content ? renderContent(message.content) : null}
                {/* 如果消息正在加载，在内容后面显示加载动画 */}
                {message.isLoading && (
                  <div className="typing-indicator inline">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
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
            placeholder="输入自然语言或Linux命令，例如：列出当前目录下的所有文件 或 ls -la..."
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

