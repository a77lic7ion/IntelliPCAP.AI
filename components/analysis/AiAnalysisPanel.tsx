import React, { useState } from 'react';
import { AnalysisTier, AnalysisSummary } from '../../types';
import { ANALYSIS_TIERS } from '../../constants';
import { CheckCircleIcon } from '../common/Icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface AiAnalysisPanelProps {
  onRunAnalysis: (tierId: 'quick' | 'standard' | 'comprehensive') => void;
  summary: AnalysisSummary | null;
  isLoading: boolean;
  totalPackets: number;
}

const COLORS = ['#00F2A9', '#A162F7', '#FFA500', '#3B82F6', '#EC4899', '#A0A0A0'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const AiAnalysisPanel: React.FC<AiAnalysisPanelProps> = ({ onRunAnalysis, summary, isLoading, totalPackets }) => {
  const [selectedTier, setSelectedTier] = useState<AnalysisTier['id']>('comprehensive');

  const handleRunAnalysis = () => {
    onRunAnalysis(selectedTier);
  };
  
  const renderTier = (tier: AnalysisTier) => (
    <div
      key={tier.id}
      onClick={() => setSelectedTier(tier.id)}
      className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedTier === tier.id ? 'border-brand-green bg-brand-gray-light' : 'border-brand-gray-light bg-brand-gray-dark hover:bg-brand-gray-light'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-white">{tier.name}</h4>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${tier.credits > 0 ? 'bg-brand-purple text-white' : 'bg-brand-green text-brand-dark'}`}>
          {tier.price}
        </span>
      </div>
      {tier.recommended && <span className="text-xs text-brand-orange mb-2 block">Recommended</span>}
      <ul className="text-xs text-brand-gray-text space-y-1">
        {tier.features.map(feature => <li key={feature}>- {feature}</li>)}
      </ul>
    </div>
  );

  return (
    <div className="bg-brand-gray-dark p-6 rounded-lg space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Smart AI Analysis</h3>
        <p className="text-sm text-brand-gray-text">Choose your analysis level - from quick local analysis to comprehensive AI insights.</p>
      </div>

      <div className="space-y-4">
        {ANALYSIS_TIERS.map(renderTier)}
      </div>

      <button
        onClick={handleRunAnalysis}
        disabled={isLoading}
        className="w-full bg-brand-green text-brand-dark font-bold py-3 rounded-md hover:bg-opacity-80 transition-all disabled:bg-brand-gray-light disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Run Analysis'}
      </button>

      {summary && (
        <div className="border-t border-brand-gray-light pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                  <p className="text-2xl font-bold text-brand-green">{summary.totalPackets.toLocaleString()}</p>
                  <p className="text-xs text-brand-gray-text">Total Packets</p>
              </div>
              <div>
                  <p className="text-2xl font-bold text-brand-red">{summary.threatsDetected.total.toLocaleString()}</p>
                  <p className="text-xs text-brand-gray-text">Threats Detected</p>
              </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Protocol Distribution</h4>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={summary.protocolDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {summary.protocolDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E1E1E',
                                border: '1px solid #2D2D2D',
                                borderRadius: '0.5rem',
                            }}
                            itemStyle={{ color: '#F5F5F5' }}
                            cursor={{ fill: 'transparent' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Key Findings</h4>
            <ul className="space-y-2">
              {summary.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircleIcon className="w-5 h-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-brand-gray-text">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAnalysisPanel;