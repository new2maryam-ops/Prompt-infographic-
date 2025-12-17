import React, { useState } from 'react';
import type { FormData } from '../types';

interface PromptPreviewProps {
  prompt: string;
  caption?: string; // Added caption prop
  formData?: FormData;
  onSave: () => void;
  onShare?: () => string;
  onShareTemplate?: (templateName: string) => string;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ 
  prompt, 
  caption, // Destructure caption
  formData,
  onSave, 
  onShare, 
  onShareTemplate,
  onOpenHistory, 
  historyCount
}) => {
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false); // State for caption copy
  const [saved, setSaved] = useState(false);
  
  // Template sharing states
  const [isNamingTemplate, setIsNamingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateLinkCopied, setTemplateLinkCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCaption = () => {
    if (caption) {
        navigator.clipboard.writeText(caption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTemplateShare = () => {
      if (onShareTemplate && templateName.trim()) {
          const link = onShareTemplate(templateName);
          if (link) {
              navigator.clipboard.writeText(link);
              setTemplateLinkCopied(true);
              setTimeout(() => {
                  setTemplateLinkCopied(false);
                  setIsNamingTemplate(false);
                  setTemplateName('');
              }, 2000);
          }
      }
  };

  const handleExportPDF = () => {
    // Check if jsPDF is available globally
    const jspdf = (window as any).jspdf;
    if (!jspdf) {
        alert("PDF generator is initializing, please try again in a moment.");
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Helper for adding text with auto-page break
    const addText = (text: string, fontSize: number, isBold: boolean = false, fontName: string = "helvetica") => {
        doc.setFontSize(fontSize);
        doc.setFont(fontName, isBold ? "bold" : "normal");
        
        // Sanitize text to handle special characters slightly better (basic Latin support in default jsPDF)
        const cleanText = text.replace(/[^\x20-\x7E\n\r]/g, ''); 
        
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        
        // Check if page break needed
        const lineHeight = fontSize * 0.3527 * 1.2;
        const blockHeight = splitText.length * lineHeight;
        
        if (yPos + blockHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = 20;
        }

        doc.text(splitText, margin, yPos);
        yPos += blockHeight + (fontSize * 0.2);
    };

    // --- PDF CONTENT GENERATION ---
    
    // Header
    addText("INFOGRAPHIC PROJECT PLAN", 18, true);
    yPos += 5;

    // Meta Data
    if (formData) {
        addText(`Title: ${formData.title}`, 12, true);
        if (formData.subtitle) addText(`Subtitle: ${formData.subtitle}`, 11);
        
        addText(`Purpose: ${formData.purpose}`, 10);
        
        // Main Visual Info
        yPos += 3;
        addText("Main Subject:", 11, true);
        addText(formData.main_subject, 10);
        if (formData.main_attribute) addText(`Attributes: ${formData.main_attribute}`, 10);
        
        // Sections
        if (formData.sections && formData.sections.length > 0) {
            yPos += 5;
            addText("SECTIONS STRUCTURE:", 12, true);
            formData.sections.forEach((section, i) => {
                // Check page break for section block
                if (yPos > doc.internal.pageSize.getHeight() - 40) {
                     doc.addPage();
                     yPos = 20;
                }
                
                addText(`${i+1}. ${section.title}`, 11, true);
                addText(`   Text: ${section.text}`, 10);
                addText(`   Visual Hint: ${section.visual_hint}`, 10, false, "courier");
                yPos += 2;
            });
        }
        
        // Side Panels
        const panels = [];
        if (formData.enable_timeline) panels.push('Timeline');
        if (formData.enable_map) panels.push('Map/Location');
        if (formData.enable_factbox) panels.push('Factbox');
        if (formData.enable_statistics) panels.push('Statistics');
        if (formData.enable_quote) panels.push('Quote');
        if (formData.enable_qr_code) panels.push('QR Code');
        
        if (panels.length > 0) {
            yPos += 5;
            addText(`Additional Panels: ${panels.join(', ')}`, 10, true);
        }
    }

    // The Prompt
    yPos += 8;
    // Force new page if low on space
    if (yPos > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        yPos = 20;
    }
    
    addText("GENERATED PROMPT:", 12, true);
    // Draw a box background for prompt? Maybe too complex. Just text.
    addText(prompt, 9, false, "courier");

    // Caption
    if (caption) {
        yPos += 8;
        if (yPos > doc.internal.pageSize.getHeight() - 60) {
            doc.addPage();
            yPos = 20;
        }
        addText("SOCIAL MEDIA CAPTION:", 12, true);
        addText(caption, 9, false, "courier");
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(`Generated by R_BESAR.ID Builder - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`${formData?.title || 'project'}_plan_${Date.now()}.pdf`);
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 1 7.143 7.143c.241.484.798.712 1.21.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Prompt Preview
        </h2>
        <div className="flex flex-wrap gap-2">
            {onOpenHistory && (
                <button
                    onClick={onOpenHistory}
                    className="px-3 py-1 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 relative"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Riwayat
                    {historyCount !== undefined && historyCount > 0 && (
                         <span className="flex h-2 w-2 absolute top-0 right-0 -mt-1 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </button>
            )}

            {/* Export PDF Button */}
            <button
                onClick={handleExportPDF}
                className="px-3 py-1 text-sm bg-green-700 border border-green-600 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                title="Export as PDF"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                PDF
            </button>

            {/* Share as Template Button */}
            {onShareTemplate && (
                <button
                    onClick={() => setIsNamingTemplate(!isNamingTemplate)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                        isNamingTemplate 
                        ? 'bg-blue-800 text-white border border-blue-500' 
                        : 'bg-blue-700 text-white hover:bg-blue-600'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                    Share
                </button>
            )}

            <button
              onClick={handleSave}
              className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              {saved ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tersimpan
                </>
              ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                    Save
                </>
              )}
            </button>
            <button
              onClick={handleCopy}
              className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
                  copied ? 'bg-green-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied
                  </>
              ) : (
                  <>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy
                  </>
              )}
            </button>
        </div>
      </div>
      
      {/* Template Naming Popover */}
      {isNamingTemplate && (
          <div className="absolute right-0 top-16 z-20 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 animate-in slide-in-from-top-2 duration-200">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Beri Nama Template</h4>
              <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Contoh: Template Sejarah Minimalis"
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white mb-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
              />
              <div className="flex justify-end gap-2">
                  <button 
                      onClick={() => setIsNamingTemplate(false)}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                      Batal
                  </button>
                  <button 
                      onClick={handleTemplateShare}
                      disabled={!templateName.trim()}
                      className={`px-3 py-1.5 text-xs font-semibold rounded text-white transition-colors ${
                          templateName.trim() 
                          ? 'bg-indigo-600 hover:bg-indigo-500' 
                          : 'bg-gray-700 cursor-not-allowed text-gray-500'
                      }`}
                  >
                      {templateLinkCopied ? 'Link Disalin!' : 'Salin Link'}
                  </button>
              </div>
              <div className="absolute top-0 right-4 w-3 h-3 bg-gray-800 border-t border-l border-gray-600 transform rotate-45 -translate-y-1/2"></div>
          </div>
      )}

      <div className="prose prose-invert prose-sm max-w-none bg-gray-900/70 p-4 rounded-md mb-6">
        <p className="text-gray-300 whitespace-pre-wrap break-words">{prompt}</p>
      </div>

      {/* Social Media Caption Section */}
      {caption && (
          <div className="mt-6 border-t border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                   <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        Social Media Caption (Auto)
                   </h3>
                   <button
                      onClick={handleCopyCaption}
                      className={`px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 ${
                          captionCopied ? 'bg-green-600 text-white' : 'bg-purple-700 text-white hover:bg-purple-600'
                      }`}
                    >
                      {captionCopied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Disalin
                          </>
                      ) : (
                          <>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                            Copy Caption
                          </>
                      )}
                    </button>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-md border border-purple-900/30">
                  <p className="text-gray-300 whitespace-pre-wrap break-words font-sans text-sm">{caption}</p>
              </div>
          </div>
      )}
    </div>
  );
};