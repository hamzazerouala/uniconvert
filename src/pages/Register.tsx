import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '@/store/authStore'
import type { Subscription } from '@/store/authStore'
import { authRegister } from '@/utils/api'

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setSubscription, setToken } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authRegister(email, password, name)
      setUser(res.user)
      setSubscription({
        plan: res.subscription.plan as Subscription['plan'],
        status: res.subscription.status as Subscription['status'],
        conversionsUsed: res.subscription.conversionsUsed,
        maxConversions: res.subscription.maxConversions,
      })
      setToken(res.token)
      navigate('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
            </div>
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 font-medium">
              {t('pricing.backHome')}
            </button>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded"
            >
              {['fr','en','es','de','zh','ja','ru','ar','fa','pt','hi'].map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('auth.createAccount')}</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('form.name')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('form.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('form.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <button disabled={loading} type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? '...' : t('auth.createAccount')}
            </button>
          </form>
          <div className="text-sm text-gray-600 mt-4">
            <span>{t('auth.alreadyRegisteredQuestion')}</span>
            <button className="text-blue-600" onClick={() => navigate('/login')}>{t('auth.signIn')}</button>
          </div>
        </div>
      </main>
    </div>
  )
}
