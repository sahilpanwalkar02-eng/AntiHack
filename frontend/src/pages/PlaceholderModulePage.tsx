import React from 'react';
import { Card } from '../components/ui/Card';
import { Shield, Sparkles } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  phase: string;
}

export const PlaceholderModulePage: React.FC<Props> = ({ title, description, phase }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-400" /> {title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>

      <Card className="text-center py-16 px-6 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-cyber-glow">
          <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white">{title} Ready for Next Phase</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {description} Module structure and frontend components are initialized. Database models & API integrations will be fully active in {phase}.
        </p>
        <span className="inline-block px-3 py-1 text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 rounded-lg">
          Phase 1 Architecture Integrated
        </span>
      </Card>
    </div>
  );
};
