import React from 'react';
import { Upload, Settings, Eye, Download, Check } from 'lucide-react';
import { ConversionStep } from '../types';

interface ConversionStatusProps {
  currentStep: ConversionStep;
}

export const ConversionStatus: React.FC<ConversionStatusProps> = ({ currentStep }) => {
  const steps = [
    { key: 'upload', label: 'Upload File', icon: Upload },
    { key: 'inputs', label: 'Configure', icon: Settings },
    { key: 'preview', label: 'Preview', icon: Eye },
    { key: 'export', label: 'Export', icon: Download }
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${status === 'completed' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : status === 'current'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                  }
                `}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    status === 'current' ? 'text-blue-700' : 
                    status === 'completed' ? 'text-green-700' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  getStepStatus(steps[index + 1].key) === 'completed' || 
                  (status === 'completed' && getStepStatus(steps[index + 1].key) === 'current')
                    ? 'bg-green-500' 
                    : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};