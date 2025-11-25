import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export default function Account() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, subscription, logout } = useAuthStore()

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!user ? (
            <div className="text-center">
              <p className="text-gray-700 mb-4">{t('header.login')}</p>
              <div className="space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => navigate('/login')}>{t('auth.signIn')}</button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded" onClick={() => navigate('/register')}>{t('auth.signUp')}</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('account.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <p className="text-sm text-gray-500">{t('account.email')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="p-4 border rounded">
                  <p className="text-sm text-gray-500">{t('account.plan')}</p>
                  <p className="font-medium">{subscription.plan}</p>
                </div>
                <div className="p-4 border rounded">
                  <p className="text-sm text-gray-500">{t('account.conversionsUsed')}</p>
                  <p className="font-medium">{subscription.conversionsUsed} / {subscription.maxConversions === -1 ? t('account.unlimited') : subscription.maxConversions}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => navigate('/pricing')}>{t('account.changePlan')}</button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded" onClick={() => { logout(); navigate('/'); }}>{t('account.logout')}</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
