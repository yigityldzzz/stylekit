'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying StyleKit and personal projects.',
    cta: 'Add to Chrome — Free',
    ctaHref: '#',
    ctaStyle: 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white hover:bg-white/5',
    popular: false,
    features: [
      'Chrome Extension',
      'Extract from any website',
      'DESIGN.md export',
      'Copy to clipboard',
      'Colors & typography extraction',
      '25 exports / month',
    ],
    missing: [
      'Unlimited exports',
      'Framework export (Tailwind, CSS)',
      'JSON / SCSS export',
      'CLI tool',
      'Team workspace',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 150 },
    description: 'For developers who want the full design extraction workflow.',
    cta: 'Coming Soon',
    ctaHref: '#',
    ctaStyle: 'bg-zinc-800 text-zinc-500 cursor-not-allowed',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited exports',
      'All token types (spacing, shadows, radius)',
      'Framework export (Tailwind, CSS variables, SCSS)',
      'JSON export',
      'CLI tool (npx stylekit-ai)',
      'Export history',
      'Email support',
    ],
    missing: [
      'Team workspace',
      'Shared library',
      'Priority support',
    ],
  },
  {
    name: 'Team',
    price: { monthly: 39, yearly: 300 },
    description: 'Share design systems across your entire team.',
    cta: 'Coming Soon',
    ctaHref: '#',
    ctaStyle: 'border border-zinc-800 text-zinc-600 cursor-not-allowed',
    popular: false,
    features: [
      'Everything in Pro',
      '5 team seats',
      'Shared design system library',
      'Team workspace',
      'Admin dashboard',
      'SSO (coming soon)',
      'Priority support',
    ],
    missing: [],
  },
]

export default function Pricing({ standalone = false }: { standalone?: boolean }) {
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" className={`relative py-24 md:py-32 bg-zinc-950 ${standalone ? 'min-h-screen' : ''}`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Start free. Upgrade when you need more power. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !yearly ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Yearly
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-medium">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 ${
                plan.popular
                  ? 'bg-zinc-900 border-2 border-violet-500/40 shadow-2xl shadow-violet-900/20 hover:border-violet-500/60'
                  : 'glass-card hover:border-zinc-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold shadow-lg shadow-violet-900/50">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan name & description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold text-white">
                    ${yearly ? plan.price.yearly : plan.price.monthly * 12}
                  </span>
                  {plan.price.yearly > 0 && (
                    <span className="text-sm text-zinc-500">
                      {yearly ? '/year' : '/year'}
                    </span>
                  )}
                </div>
                {plan.price.yearly === 0 && (
                  <div className="text-sm text-zinc-500 mt-1">Free forever</div>
                )}
                {plan.price.yearly > 0 && (
                  <div className="text-xs text-zinc-600 mt-1">
                    ~${yearly
                      ? Math.round(plan.price.yearly / 12)
                      : plan.price.monthly} per month
                  </div>
                )}
              </div>

              {/* CTA */}
              <a
                href={plan.cta === 'Coming Soon' ? undefined : plan.ctaHref}
                onClick={plan.cta === 'Coming Soon' ? (e) => e.preventDefault() : undefined}
                className={`block text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 mb-7 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>

              {/* Divider */}
              <div className="h-px bg-zinc-800 mb-6" />

              {/* Features */}
              <div className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-emerald-400 mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-sm text-zinc-400">{feature}</span>
                  </div>
                ))}
                {plan.missing.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 opacity-40">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-zinc-600 mt-0.5 flex-shrink-0"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span className="text-sm text-zinc-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ / fine print */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-600">
            All plans include a 7-day free trial. No credit card required to start.{' '}
            <a href="mailto:info@digitaladexpert.de" className="text-violet-400 hover:text-violet-300 transition-colors">
              Contact us
            </a>{' '}
            for enterprise pricing.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  )
}
