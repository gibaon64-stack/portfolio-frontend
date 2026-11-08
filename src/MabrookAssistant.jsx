import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { getAssistantStatus, sendAssistantMessage } from './api'
import './MabrookAssistant.css'

const QUICK_ACTIONS = [
  'What services do you offer?',
  'I want to build a website.',
  'How much does a website cost?',
  'Can you help me build an e-commerce website?',
  'How do I start a project?',
  'Can I speak to your team?',
]

const WELCOME_MESSAGE = "Hi! Welcome to Mabrixel Technologies. I'm Mabrook, your digital assistant. I can help you explore our services, understand website development, discover our projects, and guide you through starting your next project.\n\nHow can I help you today?"

export default function MabrookAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [availability, setAvailability] = useState('checking')
  const [error, setError] = useState('')
  const messageListRef = useRef(null)

  useEffect(() => {
    getAssistantStatus()
      .then((status) => setAvailability(status.available ? 'available' : 'offline'))
      .catch(() => setAvailability('offline'))
  }, [])

  useEffect(() => {
    if (isOpen && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [isOpen, messages, isSending])

  async function sendMessage(text) {
    const message = text.trim()
    if (!message || isSending) return
    if (availability !== 'available') {
      setError('Mabrook is currently unavailable. Please try again later.')
      return
    }

    const history = messages.map(({ role, text: messageText }) => ({ role, text: messageText }))
    setMessages((current) => [...current, { role: 'user', text: message }])
    setDraft('')
    setError('')
    setIsSending(true)
    try {
      const response = await sendAssistantMessage(message, history)
      setMessages((current) => [...current, { role: 'model', text: response.reply }])
    } catch (sendError) {
      setError(sendError.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="mabrook-widget">
      {isOpen && (
        <section className="mabrook-panel" aria-label="Chat with Mabrook">
          <header className="mabrook-header">
            <div className="mabrook-avatar"><Sparkles aria-hidden="true" /></div>
            <div className="mabrook-title">
              <strong>Mabrook</strong>
              <span className={availability === 'available' ? 'is-online' : 'is-offline'}>
                <i aria-hidden="true" />
                {availability === 'available' ? 'Online' : availability === 'checking' ? 'Connecting…' : 'Currently offline'}
              </span>
            </div>
            <button type="button" className="mabrook-close" onClick={() => setIsOpen(false)} aria-label="Close Mabrook chat">
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="mabrook-messages" ref={messageListRef} aria-live="polite">
            <p className="mabrook-message model-message">{WELCOME_MESSAGE}</p>
            {messages.map((message, index) => (
              <p className={`mabrook-message ${message.role === 'user' ? 'user-message' : 'model-message'}`} key={`${index}-${message.role}`}>
                {message.text}
              </p>
            ))}
            {isSending && <p className="mabrook-message model-message mabrook-loading"><LoaderCircle aria-hidden="true" /> Mabrook is thinking…</p>}
            {messages.length === 0 && !isSending && (
              <div className="mabrook-quick-actions" aria-label="Suggested questions">
                {QUICK_ACTIONS.map((question) => (
                  <button type="button" key={question} onClick={() => sendMessage(question)}>{question}</button>
                ))}
              </div>
            )}
          </div>

          <form className="mabrook-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(draft) }}>
            {error && <p className="mabrook-error" role="alert">{error}</p>}
            <label className="visually-hidden" htmlFor="mabrook-message">Message Mabrook</label>
            <input
              id="mabrook-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Mabrook a question…"
              maxLength={1500}
              disabled={isSending || availability !== 'available'}
            />
            <button type="submit" disabled={!draft.trim() || isSending || availability !== 'available'} aria-label="Send message">
              <Send aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        className="mabrook-launcher"
        type="button"
        aria-label={isOpen ? 'Close Mabrook chat' : 'Chat with Mabrook'}
        aria-expanded={isOpen}
        title="Chat with Mabrook"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
      </button>
    </div>
  )
}
