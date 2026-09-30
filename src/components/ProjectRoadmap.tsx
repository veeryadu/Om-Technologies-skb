import React, { useState } from 'react';
import { Flag, CheckCircle, Clock, Zap, Sparkles, ChevronRight, Layers, Info } from 'lucide-react';

interface MilestonePhase {
  id: string;
  quarter: string;
  title: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  highlight: string;
  details: {
    description: string;
    deliverables: string[];
    targetDate: string;
    impact: string;
  };
}

export const ProjectRoadmap: React.FC = () => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>('q2');

  const phases: MilestonePhase[] = [
    {
      id: 'q1',
      quarter: 'Phase 1: Foundation',
      title: 'Obsidian UI & 3D Core',
      status: 'completed',
      progress: 100,
      highlight: 'Design token architecture & Canvas particle sphere',
      details: {
        description: 'Complete high-fidelity design system establishment with dark obsidian UI and dynamic WebGL/Canvas mathematical particle globe.',
        deliverables: ['Responsive bento glassmorphism', 'Real-time 3D particle physics', 'Brand typography tokens'],
        targetDate: 'Q1 2026',
        impact: 'Achieved sub-16ms 60fps render latency on canvas',
      },
    },
    {
      id: 'q2',
      quarter: 'Phase 2: Intelligence',
      title: 'Multimodal Voice & Chat Agent',
      status: 'in_progress',
      progress: 75,
      highlight: 'Gemini-3.8-flash speech-to-text & instant reasoning',
      details: {
        description: 'Direct conversational AI assistant with speech recognition, text-to-speech audio wave synchronization, and WhatsApp quick connect.',
        deliverables: ['Real-time audio visualizer', 'Multilingual Hindi/English engine', 'WhatsApp business pipeline'],
        targetDate: 'Q2 2026',
        impact: 'Zero cold-start agent inference and voice synthesis',
      },
    },
    {
      id: 'q3',
      quarter: 'Phase 3: Workflows',
      title: 'Autonomous Multi-Agent Mesh',
      status: 'upcoming',
      progress: 25,
      highlight: 'Cross-platform triggers (Slack, GitHub, Postgres)',
      details: {
        description: 'Self-healing workflow pipelines connecting external data sinks with event-driven autonomous execution triggers.',
        deliverables: ['One-click cloud connectors', 'Telemetry token dashboard', 'Automated fallback arbitration'],
        targetDate: 'Q3 2026',
        impact: 'Reduces routine devOps and support operations by 68%',
      },
    },
    {
      id: 'q4',
      quarter: 'Phase 4: Scale',
      title: 'Global Edge AI Orchestration',
      status: 'upcoming',
      progress: 0,
      highlight: 'Distributed inference nodes & enterprise SLA',
      details: {
        description: 'Multi-region failover and sovereign LLM deployment options for high-throughput enterprise infrastructure.',
        deliverables: ['Sub-20ms global edge caching', 'SOC2 / HIPAA guardrails', 'Enterprise role-based access'],
        targetDate: 'Q4 2026',
        impact: 'Guaranteed 99.99% uptime with global edge consensus',
      },
    },
  ];

  return (
    <div className="pt-3 mt-3 border-t border-neutral-100">
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-red-500" />
          <span>Project Roadmap & Milestones</span>
        </h4>
        <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
          <Info className="w-3 h-3 text-neutral-400" />
          Hover or tap for specs
        </span>
      </div>

      <div className="space-y-2">
        {phases.map((phase) => {
          const isTooltipOpen = activeTooltipId === phase.id;

          return (
            <div
              key={phase.id}
              className="relative group"
              onMouseEnter={() => setActiveTooltipId(phase.id)}
              onMouseLeave={() => setActiveTooltipId(null)}
            >
              {/* Milestone Summary Row */}
              <div
                onClick={() => setActiveTooltipId(isTooltipOpen ? null : phase.id)}
                className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isTooltipOpen
                    ? 'bg-neutral-50/90 border-red-300 ring-1 ring-red-100 shadow-sm'
                    : 'bg-white hover:bg-neutral-50/60 border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Status Icon */}
                    {phase.status === 'completed' ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    ) : phase.status === 'in_progress' ? (
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 animate-pulse">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          {phase.quarter}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            phase.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : phase.status === 'in_progress'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                          }`}
                        >
                          {phase.status === 'completed'
                            ? 'Complete'
                            : phase.status === 'in_progress'
                            ? 'Active (75%)'
                            : 'Planned'}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-neutral-900 truncate">
                        {phase.title}
                      </h5>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-neutral-500 tabular-nums shrink-0">
                    {phase.details.targetDate}
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500'
                        : phase.status === 'in_progress'
                        ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : 'bg-neutral-300'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>

              {/* Interactive Tooltip Popover */}
              {isTooltipOpen && (
                <div className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-80 top-full mt-1.5 z-40 p-3.5 bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-700 animate-in fade-in zoom-in-95 duration-150">
                  {/* Tooltip Arrow */}
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-neutral-900 border-t border-l border-neutral-700 rotate-45" />

                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {phase.quarter}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Target: {phase.details.targetDate}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-200 mt-2 leading-relaxed font-normal">
                    {phase.details.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1 text-[11px] text-neutral-300">
                      {phase.details.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-red-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10.5px]">
                    <span className="text-neutral-400">Projected Impact:</span>
                    <span className="text-emerald-400 font-semibold">{phase.details.impact}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
