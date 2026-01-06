import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Users, Clock, TrendingUp } from 'lucide-react';

export function ROICalculator() {
  const [inputs, setInputs] = useState({
    monthlyLeads: 100,
    closeRate: 20,
    avgTransaction: 500,
    responseTime: 6,
  });

  // Calculate improvements
  const currentClosedDeals = Math.round(inputs.monthlyLeads * (inputs.closeRate / 100));
  const currentRevenue = currentClosedDeals * inputs.avgTransaction;

  // With MerkadFlow improvements (based on real data)
  // Logic: Faster current response time (lower number) = Higher multiplier (Better)
  // Starts at ~1.6x (60% boost) for 1hr and decays to ~1.2x (20% boost) for 24hr
  const improvementMultiplier = 1.6 - (inputs.responseTime * 0.016);
  const improvedCloseRate = Math.min(inputs.closeRate * improvementMultiplier, 80); // Cap at 80%
  const improvedLeads = Math.round(inputs.monthlyLeads * 1.15); // 15% more leads captured
  const improvedClosedDeals = Math.round(improvedLeads * (improvedCloseRate / 100));
  const projectedRevenue = improvedClosedDeals * inputs.avgTransaction;

  const revenueIncrease = projectedRevenue - currentRevenue;
  const percentIncrease = Math.round((revenueIncrease / currentRevenue) * 100);

  /* Removed handleCalculate and showResults state */

  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                ROI Calculator
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Calculate Your Growth Potential
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg max-w-2xl mx-auto">
                See how much revenue you could add by improving lead response and conversion with the MerkadFlow System™.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="card-gradient-border">
                <div className="card-gradient-border-inner">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Your Current Numbers</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                        <Users className="w-4 h-4 text-merkad-purple-light" />
                        Monthly Leads
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        value={inputs.monthlyLeads}
                        onChange={(e) => setInputs({ ...inputs, monthlyLeads: Number(e.target.value) })}
                        className="w-full accent-merkad-purple"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-merkad-text-muted">10</span>
                        <span className="text-merkad-purple-light font-mono font-bold">{inputs.monthlyLeads}</span>
                        <span className="text-merkad-text-muted">500</span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                        <TrendingUp className="w-4 h-4 text-merkad-purple-light" />
                        Close Rate (%)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={inputs.closeRate}
                        onChange={(e) => setInputs({ ...inputs, closeRate: Number(e.target.value) })}
                        className="w-full accent-merkad-purple"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-merkad-text-muted">5%</span>
                        <span className="text-merkad-purple-light font-mono font-bold">{inputs.closeRate}%</span>
                        <span className="text-merkad-text-muted">50%</span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                        <DollarSign className="w-4 h-4 text-merkad-purple-light" />
                        Average Transaction Value ($)
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={inputs.avgTransaction}
                        onChange={(e) => setInputs({ ...inputs, avgTransaction: Number(e.target.value) })}
                        className="w-full accent-merkad-purple"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-merkad-text-muted">$100</span>
                        <span className="text-merkad-purple-light font-mono font-bold">${inputs.avgTransaction}</span>
                        <span className="text-merkad-text-muted">$5,000</span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                        <Clock className="w-4 h-4 text-merkad-purple-light" />
                        Current Response Time (hours)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={inputs.responseTime}
                        onChange={(e) => setInputs({ ...inputs, responseTime: Number(e.target.value) })}
                        className="w-full accent-merkad-purple"
                      />
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-merkad-text-muted">1hr</span>
                        <span className="text-merkad-purple-light font-mono font-bold">{inputs.responseTime}hrs</span>
                        <span className="text-merkad-text-muted">24hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {/* Current State */}
                <div className="bg-merkad-bg-tertiary rounded-xl p-6 border border-white/5">
                  <h4 className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider mb-4">Current Monthly Revenue</h4>
                  <div className="text-4xl font-mono font-bold text-white">
                    ${currentRevenue.toLocaleString()}
                  </div>
                  <p className="text-merkad-text-muted text-sm mt-2">
                    {currentClosedDeals} deals at {inputs.closeRate}% close rate
                  </p>
                </div>

                <>
                  {/* Projected State */}
                  <div className="stats-card">
                    <div className="stats-card-inner">
                      <h4 className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider mb-4">
                        Projected With MerkadFlow
                      </h4>
                      <div className="text-4xl font-mono font-bold text-merkad-green text-glow">
                        ${projectedRevenue.toLocaleString()}
                      </div>
                      <p className="text-merkad-text-muted text-sm mt-2">
                        {improvedClosedDeals} deals at {Math.round(improvedCloseRate)}% close rate
                      </p>
                    </div>
                  </div>

                  {/* Improvement */}
                  <div className="bg-merkad-bg-tertiary rounded-xl p-6 border border-merkad-purple/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-merkad-text-muted mb-1">Monthly Increase</div>
                        <div className="text-2xl font-mono font-bold text-merkad-green">
                          +${revenueIncrease.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-merkad-text-muted mb-1">Growth</div>
                        <div className="text-2xl font-mono font-bold text-merkad-purple-light">
                          +{percentIncrease}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-4">
                    <p className="text-merkad-text-secondary mb-4">
                      Ready to unlock this growth?
                    </p>
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                    >
                      Book Discovery Call
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
