'use client';

import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  ClipboardList, 
  Smartphone, 
  Tv, 
  BarChart3, 
  RefreshCw,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Radio
} from 'lucide-react';

export type ViewMode = 'reception' | 'doctor' | 'patient' | 'display' | 'analytics';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQuickPatient: () => void;
  onCallNextQuick: () => void;
  onSimulateEmergency: () => void;
  onResetData: () => void;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  waitingCount: number;
}

export default function Navbar({
  currentView,
  onViewChange,
  onQuickPatient,
  onCallNextQuick,
  onSimulateEmergency,
  onResetData,
  isRefreshing,
  onManualRefresh,
  waitingCount
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(15,23,42,0.06)] transition-all">
      {/* Top Banner & Quick Scenarios */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 shadow-inner">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-teal-500/20 text-teal-200 font-bold border border-teal-400/40 text-[11px] shadow-[0_0_12px_rgba(20,184,166,0.2)] tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
            </span>
            <span className="bg-gradient-to-r from-teal-200 to-cyan-100 bg-clip-text text-transparent font-extrabold tracking-wide uppercase text-[10.5px]">
              Smart Healthcare Queue Management
            </span>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-xs font-medium">
            <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Active Queue:</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 font-bold border border-teal-500/30">
              {waitingCount} waiting
            </span>
          </div>
        </div>

        {/* Quick Demo Scenario Actions */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-slate-400 font-medium text-[11px] mr-1 hidden sm:inline flex items-center gap-1">
            ⚡ <span className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Demo Scenarios:</span>
          </span>
          
          <button
            onClick={onQuickPatient}
            className="px-3 py-1 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[11px] font-medium transition-all shadow-xs hover:shadow hover:border-slate-600 active:scale-95 cursor-pointer"
            title="Fast check-in a realistic sample patient"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>+ Quick Patient</span>
          </button>
          
          <button
            onClick={onCallNextQuick}
            className="px-3 py-1 bg-gradient-to-r from-teal-900/90 to-emerald-900/90 hover:from-teal-800 hover:to-emerald-800 text-teal-100 rounded-lg border border-teal-700/80 flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-xs hover:shadow-teal-900/40 hover:shadow-md active:scale-95 cursor-pointer"
            title="Doctor calls next highest priority patient"
          >
            <Stethoscope className="w-3 h-3 text-teal-300" />
            <span>Call Next</span>
          </button>
          
          <button
            onClick={onSimulateEmergency}
            className="px-3 py-1 bg-gradient-to-r from-rose-950/90 to-red-950/90 hover:from-rose-900 hover:to-red-900 text-rose-100 rounded-lg border border-rose-800/80 flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-xs hover:shadow-rose-900/40 hover:shadow-md active:scale-95 cursor-pointer"
            title="Check-in an emergency case to demo priority sorting"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400 animate-heartbeat" />
            <span>Simulate Emergency</span>
          </button>
          
          <button
            onClick={onResetData}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg border border-slate-700/80 flex items-center gap-1 text-[11px] font-medium transition-all hover:border-slate-600 active:scale-95 cursor-pointer"
            title="Reset to fresh sample data"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 border border-teal-400/30 transition-transform duration-300 group-hover:scale-105">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Pulse<span className="text-teal-600 drop-shadow-xs">Queue</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-800 border border-teal-200/90 shadow-2xs">
                  OPD Triage
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Intelligent Hospital &amp; Clinic Patient Flow Engine
              </p>
            </div>
          </div>

          {/* View Mode Segmented Control */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shadow-inner overflow-x-auto max-w-full">
            <button
              onClick={() => onViewChange('reception')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'reception'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/90 ring-1 ring-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ClipboardList className={`w-3.5 h-3.5 ${currentView === 'reception' ? 'text-teal-600' : 'text-slate-400'}`} />
              Reception Desk
            </button>

            <button
              onClick={() => onViewChange('doctor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'doctor'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/90 ring-1 ring-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 ${currentView === 'doctor' ? 'text-teal-600' : 'text-slate-400'}`} />
              Doctor Room
            </button>

            <button
              onClick={() => onViewChange('patient')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'patient'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/90 ring-1 ring-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${currentView === 'patient' ? 'text-teal-600' : 'text-slate-400'}`} />
              Patient Tracker
            </button>

            <button
              onClick={() => onViewChange('display')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'display'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/90 ring-1 ring-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Tv className={`w-3.5 h-3.5 ${currentView === 'display' ? 'text-teal-600' : 'text-slate-400'}`} />
              Waiting TV Board
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'analytics'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/90 ring-1 ring-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${currentView === 'analytics' ? 'text-teal-600' : 'text-slate-400'}`} />
              Live Audit &amp; KPIs
            </button>
          </nav>

          {/* Sync & Refresh Status */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onManualRefresh}
              className="p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50/80 rounded-xl border border-transparent hover:border-teal-200 transition-all cursor-pointer active:scale-95"
              title="Refresh live queue data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
