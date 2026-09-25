import React, { useState } from 'react';
import { sound } from '../../services/soundService';
import {
  Globe,
  Check,
  Volume2,
  VolumeX,
  HelpCircle,
  FileText,
  LogOut,
  X,
  ChevronDown,
} from 'lucide-react';
import { OFFICIAL_FAQ_ITEMS, OFFICIAL_TERMS_SECTIONS } from '../../data/ethioFantasyLegal';

interface HeaderSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'am' | 'om';
  onUpdateLanguage: (lang: 'en' | 'am' | 'om') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
}

export const HeaderSettingsMenu: React.FC<HeaderSettingsMenuProps> = ({
  isOpen,
  onClose,
  language,
  onUpdateLanguage,
  soundEnabled,
  onToggleSound,
  onLogout,
}) => {
  const [activeModal, setActiveModal] = useState<'FAQ' | 'TERMS' | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const languages: Array<{ id: 'en' | 'am' | 'om'; code: string; label: string; full: string }> = [
    { id: 'en', code: 'EN', label: 'English', full: 'English' },
    { id: 'am', code: 'አማ', label: 'አማርኛ', full: 'Amharic' },
    { id: 'om', code: 'OR', label: 'Afaan Oromoo', full: 'Oromo' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] animate-fadeIn"
      />

      {/* Dropdown Menu Panel (Positioned from top right) */}
      <div className="absolute right-4 top-14 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 py-3 text-slate-800 animate-scaleIn select-none">
        {/* Section Header: Language */}
        <div className="px-4 pb-1.5 flex items-center justify-between text-xs font-black uppercase text-slate-500 tracking-wider">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Language</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
            {language === 'en' ? 'EN' : language === 'am' ? 'አማ' : 'OR'}
          </span>
        </div>

        <div className="px-2 space-y-0.5">
          {languages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  sound.playTap();
                  onUpdateLanguage(lang.id);
                }}
                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 font-mono text-[11px] font-black text-slate-500">
                    {lang.code}
                  </span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-slate-100" />

        {/* Settings: Sound */}
        <div className="px-2 space-y-0.5">
          <button
            onClick={() => {
              sound.playTap();
              onToggleSound();
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span>Sound Effects</span>
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* FAQ */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveModal('FAQ');
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>FAQ & Rules</span>
          </button>

          {/* Terms & Conditions */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveModal('TERMS');
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Terms & Conditions</span>
          </button>
        </div>

        {/* Distinct Divider before Logout (Requirement #15) */}
        <div className="my-2 border-t-2 border-slate-100" />

        {/* Log Out Button at the BOTTOM */}
        <div className="px-2">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
              onLogout();
            }}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 active:scale-98 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* FAQ Modal */}
      {activeModal === 'FAQ' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Frequently Asked Questions
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {OFFICIAL_FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => {
                      sound.playTap();
                      setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx);
                    }}
                    className="w-full p-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
                  >
                    <span className="text-[11px] pr-2">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        expandedFaqIndex === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {expandedFaqIndex === idx && (
                    <div className="p-3 pt-0 text-[11px] text-slate-600 border-t border-slate-100 bg-white leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase cursor-pointer"
            >
              Close FAQ
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {activeModal === 'TERMS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Terms & Conditions
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              {OFFICIAL_TERMS_SECTIONS.map((sec, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{sec.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase cursor-pointer"
            >
              Close Terms
            </button>
          </div>
        </div>
      )}
    </>
  );
};
