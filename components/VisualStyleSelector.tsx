import React, { useState } from 'react';
import { VISUAL_STYLES } from '../constants';

interface VisualStyleSelectorProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
}

export const VisualStyleSelector: React.FC<VisualStyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentStyle = VISUAL_STYLES.find(s => s.value === selectedStyle);

  return (
    <>
        <div className="relative">
            <label className="block text-sm font-medium text-blue-300 mb-1">Gaya Visual</label>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 text-left text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[42px] flex items-center gap-3 transition-colors hover:border-blue-500/50"
            >
                <span className="block truncate">{currentStyle?.label || 'Pilih Gaya...'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>
        </div>

        {isOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 animate-in slide-in-from-bottom-10 fade-in duration-300">
                {/* Header Fullscreen */}
                <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 shadow-md">
                     <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                         <div>
                            <h3 className="text-2xl font-bold text-blue-400">Galeri Gaya Visual</h3>
                            <p className="text-sm text-gray-400 mt-1">Pilih gaya yang paling sesuai dengan tone desain Anda</p>
                         </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 text-sm font-medium transition-colors border border-gray-700 ml-4 shadow-sm"
                        >
                            Tutup
                        </button>
                     </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-950 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {VISUAL_STYLES.map((style) => {
                                const isSelected = selectedStyle === style.value;
                                return (
                                    <div
                                        key={style.value}
                                        onClick={() => {
                                            onSelect(style.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            cursor-pointer group relative rounded-xl border-2 transition-all duration-200 flex flex-col h-full overflow-hidden
                                            ${isSelected 
                                                ? 'bg-gray-900 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-[1.02] z-10' 
                                                : 'bg-gray-900/40 border-gray-800 hover:border-blue-500/50 hover:bg-gray-800 hover:-translate-y-1'
                                            }
                                        `}
                                    >
                                        <div className="p-4 sm:p-5 flex-grow flex flex-col relative">
                                            {/* Selection Checkmark */}
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 text-blue-500 bg-blue-500/10 rounded-full p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="mb-3 pr-6">
                                                <h4 className={`font-bold text-base sm:text-lg leading-tight ${isSelected ? 'text-blue-400' : 'text-gray-200 group-hover:text-blue-300'}`}>
                                                    {style.label}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed flex-grow font-mono break-words opacity-80 group-hover:opacity-100">
                                                {style.prompt_fragment}
                                            </p>
                                        </div>
                                        {/* Footer strip for visual feedback */}
                                        <div className={`h-1 w-full ${isSelected ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500/30'}`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};