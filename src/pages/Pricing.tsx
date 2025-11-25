import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
}


export default function Pricing() {
  const { t, i18n } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const computedPlans: PricingPlan[] = [
    {
      name: t('plan.free.name'),
      price: 0,
      period: t('plan.free.period'),
      description: t('plan.free.description'),
      features: [
        t('plan.free.features.daily'),
        t('plan.free.features.basicFormats'),
        t('plan.free.features.max50'),
        t('plan.free.features.emailSupport')
      ],
      buttonText: t('plan.free.button')
    },
    {
      name: t('plan.pro.name'),
      price: 9.99,
      period: t('plan.pro.period'),
      description: t('plan.pro.description'),
      features: [
        t('plan.pro.features.unlimited'),
        t('plan.pro.features.allFormats'),
        t('plan.pro.features.max500'),
        t('plan.pro.features.prioritySupport'),
        t('plan.pro.features.batch'),
        t('plan.pro.features.api')
      ],
      popular: true,
      buttonText: t('plan.pro.button')
    },
    {
      name: t('plan.premium.name'),
      price: 19.99,
      period: t('plan.premium.period'),
      description: t('plan.premium.description'),
      features: [
        t('plan.premium.features.unlimited'),
        t('plan.premium.features.allFormats'),
        t('plan.premium.features.max2g'),
        t('plan.premium.features.priority247'),
        t('plan.premium.features.advancedBatch'),
    	  t('plan.premium.features.fullApi'),
        t('plan.premium.features.team'),
        t('plan.premium.features.analytics')
      ],
      buttonText: t('plan.premium.button')
    }
  ];

  const getPlanPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return '0';
    if (billingCycle === 'yearly' && plan.price > 0) {
      return (plan.price * 0.8).toFixed(2); // 20% de réduction annuelle
    }
    return plan.price.toFixed(2);
  };

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      window.location.href = '/';
      return;
    }
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_BASE_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.price <= 9.99 ? 'pro' : 'premium' })
      });
      if (!res.ok) {
        alert(t('pricing.stripeSimulation'));
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(t('pricing.stripeSimulation'));
      }
    } catch {
      alert(t('pricing.stripeSimulation'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('pricing.choosePlan')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('pricing.yearly')}
            </span>
            {billingCycle === 'yearly' && (
              <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                {t('pricing.save20')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {computedPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg shadow-lg p-6 border-2 ${
                plan.popular 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{t('pricing.popular')}</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">{getPlanPrice(plan)}</span>
                  <span className="text-gray-500 ml-1">
                    {plan.price > 0 ? `/${plan.period}` : plan.period}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {t('pricing.billedYearly', { amount: (parseFloat(getPlanPrice(plan)) * 12).toFixed(2) })}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('pricing.faq')}</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('faq.q1.title')}</h4>
              <p className="text-gray-600">{t('faq.q1.body')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('faq.q2.title')}</h4>
              <p className="text-gray-600">{t('faq.q2.body')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('faq.q3.title')}</h4>
              <p className="text-gray-600">{t('faq.q3.body')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('faq.q4.title')}</h4>
              <p className="text-gray-600">{t('faq.q4.body')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
