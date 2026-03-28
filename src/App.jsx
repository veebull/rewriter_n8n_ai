import { useState } from 'react'
import { rewriteText } from './api/webhook'
import styles from './App.module.css'

const STYLES = [
  { id: 'post',     label: 'Пост',       icon: '✦' },
  { id: 'expert',   label: 'Экспертный', icon: '◈' },
  { id: 'friendly', label: 'Дружеский',  icon: '◇' },
  { id: 'sell',     label: 'Продающий',  icon: '◉' },
  { id: 'short',    label: 'Сократить',  icon: '◻' },
  { id: 'fix',      label: 'Исправить',  icon: '◼' },
]

export default function App() {
  const [inputText, setInputText] = useState('')
  const [resultText, setResultText] = useState('')
  const [activeStyle, setActiveStyle] = useState('post')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const charCount = inputText.length
  const isValid = charCount >= 20 && charCount <= 3000

  async function handleRewrite() {
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    setResultText('')
    setCopied(false)

    try {
      const result = await rewriteText(inputText, activeStyle)
      setResultText(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!resultText) return
    await navigator.clipboard.writeText(resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClear() {
    setInputText('')
    setResultText('')
    setError('')
    setCopied(false)
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>✦</div>
          <span className={styles.headerTitle}>AI Рерайтер</span>
        </div>
        <span className={styles.badge}>n8n</span>
      </header>

      <main className={styles.main}>
        {/* Style selector */}
        <div className={styles.section}>
          <p className={styles.label}>Стиль рерайта</p>
          <div className={styles.chips}>
            {STYLES.map(s => (
              <button
                key={s.id}
                className={`${styles.chip} ${activeStyle === s.id ? styles.chipActive : ''}`}
                onClick={() => setActiveStyle(s.id)}
              >
                <span className={styles.chipIcon}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={styles.section}>
          <div className={styles.labelRow}>
            <p className={styles.label}>Ваш текст</p>
            <span className={`${styles.counter} ${!isValid && charCount > 0 ? styles.counterWarn : ''}`}>
              {charCount} / 3000
            </span>
          </div>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Вставьте текст для рерайта... (минимум 20 символов)"
            rows={6}
          />
          {charCount > 0 && charCount < 20 && (
            <p className={styles.hint}>Нужно ещё {20 - charCount} символов</p>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={handleRewrite}
            disabled={!isValid || loading}
          >
            {loading ? (
              <span className={styles.loadingDots}>
                <span /><span /><span />
              </span>
            ) : (
              <>✦ Переписать</>
            )}
          </button>
          {(inputText || resultText) && (
            <button className={styles.btnSecondary} onClick={handleClear}>
              Очистить
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Result */}
        {resultText && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <p className={styles.label}>Результат</p>
              <button
                className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <p className={styles.resultText}>{resultText}</p>
          </div>
        )}
      </main>
    </div>
  )
}
