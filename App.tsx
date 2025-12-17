import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PROMPT_CONFIG, VISUAL_STYLES, PURPOSE_OPTIONS } from './constants';
import type { FormData, Section, HistoryItem } from './types';
import { Input, Textarea, Select, Checkbox, Button } from './components/FormControls';
import { SectionBuilder } from './components/SectionBuilder';
import { PromptPreview } from './components/PromptPreview';
import { VisualStyleSelector } from './components/VisualStyleSelector';
import { HistorySidebar } from './components/HistorySidebar';
import { PdfUpload } from './components/PdfUpload';
import { ImageAnalysisUpload } from './components/ImageAnalysisUpload';
import { AboutPage } from './components/AboutPage';

const PERMANENT_BRAND_URL = 'https://lynk.id/r_besar.id';

const INITIAL_DATA: FormData = {
  purpose: '',
  title: '',
  subtitle: '',
  main_subject: '',
  main_attribute: '',
  sections: [],
  enable_timeline: false,
  enable_map: false,
  enable_factbox: false,
  enable_statistics: false,
  enable_quote: false,
  enable_qr_code: false,
  enable_carousel: false,
  enable_face_fix: false, // We reuse this field for "High Accuracy Mode" to preserve history compatibility
  sources: '',
  brand_url: PERMANENT_BRAND_URL
};

type AutoGenMode = 'text' | 'pdf' | 'image';

const DateTimeWidget = ({ onShowAbout }: { onShowAbout: () => void }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[date.getDay()];
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const dateStr = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-xl flex justify-between items-center">
      <div className="text-lg font-mono tabular-nums tracking-wide text-gray-300">
        {dayName}, {dateStr}
        <span className="mx-3 text-gray-600">|</span>
        {timeStr} WIB
      </div>
       <button 
        onClick={onShowAbout} 
        className="text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-800"
        title="Tentang Aplikasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
    </div>
  );
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [visualStyle, setVisualStyle] = useState('3d_realistic');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  
  // Configuration Panel State
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // State for Auto Generate Text
  const [autoGenMode, setAutoGenMode] = useState<AutoGenMode>('text');
  const [topicInput, setTopicInput] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  
  // State for PDF Upload (Analysis)
  const [uploadedPdf, setUploadedPdf] = useState<{data: string, name: string} | null>(null);

  // State for Image Upload (Analysis)
  const [uploadedAnalysisImage, setUploadedAnalysisImage] = useState<{data: string, mimeType: string, name: string} | null>(null);

  useEffect(() => {
    // Load history from local storage
    const savedHistory = localStorage.getItem('infographic_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    // Load shared configuration from URL
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
        try {
            const json = decodeURIComponent(atob(shareParam));
            const data = JSON.parse(json);
            
            if (data.formData) {
                 setFormData({ 
                     ...INITIAL_DATA, 
                     ...data.formData, 
                     brand_url: PERMANENT_BRAND_URL
                });
            }
            if (data.visualStyle) setVisualStyle(data.visualStyle);
            if (data.aspectRatio) setAspectRatio(data.aspectRatio);
            
            if (data.templateName) {
                showNotification(`Template "${data.templateName}" berhasil dimuat!`, 'success');
            }
            
            setIsConfigOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error("Invalid share link", e);
        }
    }
  }, []);

  // Reactive Prompt Generation
  useEffect(() => {
    const hasData = formData.title.trim() !== '' || formData.main_subject.trim() !== '' || formData.sections.length > 0;
    
    if (!hasData) {
        setGeneratedPrompt('');
        setGeneratedCaption('');
        return;
    }

    const style = VISUAL_STYLES.find(s => s.value === visualStyle);
    const purpose = PURPOSE_OPTIONS.find(p => p.value === formData.purpose)?.label || formData.purpose;
    
    // Quality Boosters Logic
    let qualityBoosters = "masterpiece, best quality, professional composition, 8k resolution, highly detailed";

    switch (visualStyle) {
        case 'vintage':
        case 'vintage_blueprint':
             qualityBoosters += ", archival paper texture, intricate cross-hatching, copperplate engraving, museum quality, sepia tones, botanical illustration style";
             break;
        case 'modern_flat':
        case 'abstract_geometric':
             qualityBoosters += ", vector art, clean lines, minimalist, flat design, behance trending, dribbble aesthetic, sharp edges, vivid colors, no noise";
             break;
        case '3d_realistic':
             qualityBoosters += ", unreal engine 5 render, octane render, raytracing, global illumination, photorealistic, 8k textures, cinematic lighting, depth of field, hyper-detailed";
             break;
        case '3d_render':
        case '3d_loaded':
             qualityBoosters += ", blender 3d, claymorphism, soft studio lighting, subsurface scattering, ambient occlusion, cute 3d character, matte finish, pastel colors";
             break;
        case 'futuristic':
        case 'glowing_neon':
             qualityBoosters += ", cyberpunk aesthetic, neon glow, chromatic aberration, synthwave, futuristic interface, HUD details, dark background, bioluminescence, volumetric lighting";
             break;
        case 'watercolor':
             qualityBoosters += ", watercolor paper texture, wet-on-wet technique, alcohol ink, soft edges, artistic wash, traditional art, fluid strokes, pastel tones";
             break;
        case 'blueprint':
             qualityBoosters += ", technical drawing, schematic, white lines on blue background, precise grid, engineering diagram, CAD style, architectural plan";
             break;
        case 'isometric':
             qualityBoosters += ", isometric projection, 3d vector, orthographic view, clean geometry, sim city style, low poly aesthetic, precise angles";
             break;
        case 'paper_cutout':
             qualityBoosters += ", layered paper art, depth of field, shadowbox effect, craft texture, scissors cut edges, tactile feel, paper grain";
             break;
        case 'pop_art':
             qualityBoosters += ", halftone pattern, ben-day dots, comic book style, bold black outlines, vibrant primary colors, pop culture aesthetic, roy lichtenstein style";
             break;
        case 'wooden_carved':
             qualityBoosters += ", natural wood grain texture, bas-relief, hand carved, varnish finish, rustic aesthetic, carpentry details, tactile wood surface";
             break;
        case 'chalkboard':
             qualityBoosters += ", chalk texture, slate background, dusty residue, hand lettering, educational diagram, white chalk on green board";
             break;
        case 'pixel_art':
             qualityBoosters += ", 16-bit, pixel perfect, sprite sheet, retro gaming, dithering, arcade aesthetic, digital grid";
             break;
        case 'claymation':
             qualityBoosters += ", plasticine texture, stop motion, handmade, fingerprint details, clay shader, aardman style, physical model look";
             break;
        case 'knitted_art':
             qualityBoosters += ", wool texture, yarn strands, crochet pattern, fuzzy, fabric simulation, macro photography of fabric, warm and cozy";
             break;
        case 'minimalist_line_art':
             qualityBoosters += ", continuous line drawing, black ink on white paper, minimalism, abstraction, elegant curves, negative space";
             break;
        default:
             qualityBoosters += ", vector aesthetics, clean design, award winning graphic design, sharp focus";
    }

    // Add explicit high-accuracy tokens if enabled
    if (formData.enable_face_fix) {
        qualityBoosters += ", perfect facial likeness, accurate identity, photorealistic face, official logo accuracy, correct brand colors, authentic insignia, editorial photography";
    }
    
    let negativePrompts = "";

    // "Excellent" mode toggle (formerly carousel) enhances the single prompt
    if (formData.enable_carousel) {
        qualityBoosters += ", award-winning graphic design, cinematic lighting, hyper-detailed, intricate details, sharp focus, professional color grading, editorial quality, behance HD, artstation HQ, physically based rendering";
        negativePrompts = "low quality, jpeg artifacts, blurry, noisy, text errors, typos, watermark, signature, amateur, deformed, ugly, disfigured, poor composition, out of frame, extra limbs, bad anatomy, bad typography, crooked text, malformed logos";
    }

    let prompt = PROMPT_CONFIG.prompt_template.final_prompt_example_structure;
    
    prompt = prompt.replace('{PURPOSE}', purpose);
    prompt = prompt.replace('{VISUAL_STYLE}', style?.prompt_fragment || visualStyle);
    prompt = prompt.replace('{ASPECT_RATIO}', aspectRatio);
    prompt = prompt.replace('{TITLE}', formData.title);
    prompt = prompt.replace('{SUBTITLE}', formData.subtitle);
    prompt = prompt.replace('{SOURCES}', formData.sources);
    prompt = prompt.replace('{MAIN_SUBJECT}', formData.main_subject);
    prompt = prompt.replace('{MAIN_ATTIRE_OR_ATTRIBUTE}', formData.main_attribute);
    prompt = prompt.replace('{BRAND_URL}', PERMANENT_BRAND_URL);

    const sectionsText = formData.sections.map((s, i) => {
        return `- **Section ${i+1} (${s.title}):** [Content: ${s.text}] [Icon/Visual: ${s.visual_hint}]`;
    }).join('\n');
    
    prompt = prompt.replace('{SECTION_LIST}', sectionsText);

    const panels = [];
    if (formData.enable_timeline) panels.push('Vertical Timeline');
    if (formData.enable_map) panels.push('Geographic Map Location');
    if (formData.enable_factbox) panels.push('"Did You Know?" Factbox');
    if (formData.enable_statistics) panels.push('Statistical Chart/Graph');
    if (formData.enable_quote) panels.push('Highlight Quote Block');
    if (formData.enable_qr_code) panels.push('QR Code Element');
    
    const sidePanelsText = panels.length > 0 ? panels.join(', ') : "None";
    prompt = prompt.replace('{SIDE_PANELS}', sidePanelsText);
    prompt = prompt.replace('{QUALITY_BOOSTERS}', qualityBoosters);
    
    if (formData.enable_face_fix) {
        prompt += `\n\n**CRITICAL IDENTITY & BRANDING OVERRIDE:** \n1. **Public Figures:** Ensure perfect facial likeness for "{MAIN_SUBJECT}". \n2. **Logos/Emblems:** If a band logo, government seal, or brand logo is present, render it with **100% accuracy** to the official design. Do not hallucinate text or alter shapes. Use official brand colors. \n3. **Products:** Maintain exact product packaging details.`;
        prompt = prompt.replace('{MAIN_SUBJECT}', formData.main_subject);
    }
    
    if (negativePrompts) {
        prompt += `\n\n**8. NEGATIVE PROMPTS (AVOID THESE):**\n${negativePrompts}`;
    }

    setGeneratedPrompt(prompt);

    // Dynamic Caption Generation
    const purposeTag = formData.purpose ? formData.purpose.replace(/[^a-zA-Z0-9]/g, '') : 'Infografis';
    const titleTag = formData.title ? formData.title.replace(/\s+/g, '') : 'Info';
    
    let captionHook = "Halo Sobat! 👋";
    let actionVerb = "Simak rangkuman";
    let closingCTA = "Semoga bermanfaat!";

    switch(formData.purpose) {
        case 'marketing':
            captionHook = "🚀 **TINGKATKAN BISNIS KAMU!**";
            actionVerb = "Cek detail penawaran menarik";
            closingCTA = "🔥 **Tertarik? Hubungi kami segera!**";
            break;
        case 'education':
            captionHook = "📚 **FAKTA MENARIK HARI INI!**";
            actionVerb = "Pelajari wawasan baru";
            closingCTA = "📌 **Save postingan ini buat belajar nanti!**";
            break;
        case 'history':
            captionHook = "🕰️ **JELAJAH WAKTU**";
            actionVerb = "Ungkap kisah masa lalu";
            closingCTA = "Bagikan ke teman pecinta sejarah!";
            break;
        case 'social_media':
            captionHook = "✨ **LAGI TRENDING NIH!**";
            actionVerb = "Intip infonya";
            closingCTA = "Tag teman kamu yang perlu tau info ini!";
            break;
        case 'report':
            captionHook = "📈 **DATA INSIGHT**";
            actionVerb = "Analisis data terbaru";
            closingCTA = "Simpan untuk referensi datamu.";
            break;
        default:
            captionHook = "👋 **Halo Sobat Visual!**";
    }

    let caption = `${captionHook}\n\n`;
    caption += `📊 **${formData.title.toUpperCase()}**\n`;
    if (formData.subtitle) caption += `_${formData.subtitle}_\n`;
    caption += `\n`;

    caption += `${actionVerb} tentang ${formData.title} dalam rangkuman visual ini.\n\n`;
    caption += `💡 **Poin-Poin Utama:**\n`;
    
    formData.sections.forEach(section => {
        caption += `✅ ${section.title}\n`;
        if (section.text) {
             const firstPoint = section.text.split(';')[0].trim();
             caption += `   └ ${firstPoint}\n`;
        }
    });

    caption += `\n`;
    if (formData.sources) caption += `📚 Sumber: ${formData.sources}\n`;
    caption += `\n${closingCTA}\n`;
    
    caption += `\n----------------------------------\n`;
    caption += `✨ **Ingin konten visual sekeren ini?**\n`;
    caption += `🚀 Yuk, buat infografis profesional sekarang! Klik link di Bio.\n`;
    caption += `----------------------------------\n\n`;
    
    caption += `🎨 Design by: ${PERMANENT_BRAND_URL}\n`;
    caption += `#Infografis #${purposeTag} #Edukasi #VisualData #${titleTag} `;

    if (visualStyle.includes('vintage')) caption += `#VintageStyle #RetroArt #ClassicDesign `;
    if (visualStyle.includes('3d')) caption += `#3DDesign #DigitalArt #Render `;
    if (visualStyle.includes('flat')) caption += `#FlatDesign #Minimalist #VectorArt `;
    if (visualStyle.includes('neon') || visualStyle.includes('cyber')) caption += `#Cyberpunk #NeonVibes #Futuristic `;
    if (visualStyle.includes('paper')) caption += `#PaperCraft #Artistic `;
    
    setGeneratedCaption(caption);

  }, [formData, visualStyle, aspectRatio]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index: number, field: keyof Omit<Section, 'id'>, value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    updateFormData('sections', newSections);
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: '',
      text: '',
      visual_hint: ''
    };
    updateFormData('sections', [...formData.sections, newSection]);
  };

  const removeSection = (id: number) => {
    updateFormData('sections', formData.sections.filter(s => s.id !== id));
  };

  const handlePdfUpload = (base64Clean: string, fileName: string) => {
    setUploadedPdf({ data: base64Clean, name: fileName });
  };

  const handlePdfRemove = () => {
    setUploadedPdf(null);
  };

  const handleAnalysisImageUpload = (base64Clean: string, mimeType: string, fileName: string) => {
    setUploadedAnalysisImage({ data: base64Clean, mimeType, name: fileName });
  };

  const handleAnalysisImageRemove = () => {
    setUploadedAnalysisImage(null);
  };

  const handleAutoGenerateContent = async () => {
    if (autoGenMode === 'text' && !topicInput.trim()) {
        alert("Mohon masukkan topik terlebih dahulu.");
        return;
    }
    if (autoGenMode === 'pdf' && !uploadedPdf) {
        alert("Mohon upload file PDF terlebih dahulu.");
        return;
    }
    if (autoGenMode === 'image' && !uploadedAnalysisImage) {
        alert("Mohon upload gambar referensi terlebih dahulu.");
        return;
    }

    setIsGeneratingText(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const jsonStructureInstruction = `
        Return ONLY a valid JSON object matching exactly this structure:
        {
          "title": "A catchy, short main headline (Indonesian)",
          "subtitle": "A compelling subtitle (Indonesian)",
          "main_subject": "Description of the central hero image visual",
          "main_attribute": "Specific visual attributes/props for the hero image",
          "purpose": "One of: education, marketing, social_media, report, awareness, history",
          "sections": [
            {
              "title": "Section Title (Indonesian)",
              "text": "Brief bullet points separated by semicolons (Indonesian)",
              "visual_hint": "A short visual description for a small icon/illustration for this section"
            }
          ],
          "sources": "One single reliable source name (e.g. 'NASA', 'Wikipedia'). If unknown, return 'Rojudin'",
          "side_panels": {
             "timeline": true/false,
             "map": true/false,
             "factbox": true/false,
             "statistics": true/false,
             "quote": true/false,
             "qr_code": true/false
          },
          "requires_high_accuracy": true/false (true if subject is a public figure, a famous brand product, or contains an official logo/emblem)
        }
        Create between 4 to 6 sections.
      `;

      let parts: any[] = [];
      let promptContext = "";

      if (autoGenMode === 'text') {
        promptContext = `Focus specifically on this aspect/topic: "${topicInput}".`;
      } else if (autoGenMode === 'pdf' && uploadedPdf) {
         promptContext = `Analyze the attached PDF file deepy. Extract all key data, statistics, and the main narrative. Use this specific information to build the infographic structure.`;
         parts.push({
             inlineData: {
                 mimeType: "application/pdf",
                 data: uploadedPdf.data
             }
         });
      } else if (autoGenMode === 'image' && uploadedAnalysisImage) {
          promptContext = `Analyze the attached image thoroughly. Extract the main visual topic, the art style, and the text information structure. Create a content plan that mimics this structure.`;
          parts.push({
              inlineData: {
                  mimeType: uploadedAnalysisImage.mimeType,
                  data: uploadedAnalysisImage.data
              }
          });
      }

      const promptText = `
        Act as an expert infographic designer.
        ${promptContext}
        Create a comprehensive content plan.
        ${jsonStructureInstruction}
      `;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      const data = JSON.parse(jsonStr);

      const newSections = data.sections?.map((s: any, i: number) => ({
        id: Date.now() + i,
        title: s.title || '',
        text: s.text || '',
        visual_hint: s.visual_hint || ''
      })) || [];

      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        subtitle: data.subtitle || prev.subtitle,
        main_subject: data.main_subject || prev.main_subject,
        main_attribute: data.main_attribute || prev.main_attribute,
        purpose: data.purpose || 'education',
        sources: data.sources || 'Rojudin',
        sections: newSections,
        enable_timeline: data.side_panels?.timeline || false,
        enable_map: data.side_panels?.map || false,
        enable_factbox: data.side_panels?.factbox || false,
        enable_statistics: data.side_panels?.statistics || false,
        enable_quote: data.side_panels?.quote || false,
        enable_qr_code: data.side_panels?.qr_code || false,
        enable_carousel: false,
        enable_face_fix: data.requires_high_accuracy || false, // Renamed logic, reuses same state field
        brand_url: PERMANENT_BRAND_URL,
      }));
      
      showNotification("Konten berhasil digenerate!", "success");

    } catch (error: any) {
        console.error("Auto-generate failed:", error);
        alert("Gagal membuat konten otomatis. " + (error.message || "Pastikan format file didukung."));
    } finally {
      setIsGeneratingText(false);
    }
  };

  const generateShareLink = (templateName: string = "") => {
    try {
        const state = { 
            formData, 
            visualStyle, 
            aspectRatio,
            templateName: templateName || undefined
        };
        const json = JSON.stringify(state);
        const encoded = btoa(encodeURIComponent(json));
        return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    } catch (e) {
        console.error("Error generating share link", e);
        return "";
    }
  };

  const saveToHistory = () => {
       const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          name: formData.title || 'Untitled Infographic',
          data: { ...formData, brand_url: PERMANENT_BRAND_URL },
          visualStyle,
          aspectRatio
      };
      const newHistory = [newItem, ...history];
      setHistory(newHistory);
      localStorage.setItem('infographic_history', JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col relative">
        {/* Toast Notification */}
        {notification && (
            <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 flex items-center gap-3 bg-green-900/90 border-green-500 text-green-100">
                <span className="text-sm font-medium">{notification.message}</span>
            </div>
        )}

        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <a 
                        href="https://lynk.id/r_besar.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-none justify-center flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg bg-blue-700 hover:bg-blue-600 shadow-blue-900/20 text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        R_BESAR.ID
                    </a>
                    {/* H1 with Gradient as requested */}
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            INFOGRAPHIC PROMPT BUILDER
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
                            Platform AI untuk Produksi Prompt Infografis Terstruktur & Profesional
                        </p>
                    </div>
                </div>
            </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Auto Generate */}
                <div className="space-y-6">
                    {/* Time Widget */}
                    <DateTimeWidget onShowAbout={() => setIsAboutPageOpen(true)} />
                    
                    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl relative overflow-hidden">
                         {/* Header & Tabs */}
                        <div className="bg-gray-800/50 p-4 border-b border-gray-700">
                             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                </svg>
                                Auto Generate
                            </h2>
                            <div className="flex bg-gray-900 rounded-lg p-1 gap-1">
                                <button
                                    onClick={() => setAutoGenMode('text')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'text' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Input Teks
                                </button>
                                <button
                                    onClick={() => setAutoGenMode('pdf')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'pdf' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Upload PDF
                                </button>
                                <button
                                    onClick={() => setAutoGenMode('image')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                        autoGenMode === 'image' 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    }`}
                                >
                                    Upload Image
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            {autoGenMode === 'text' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm text-gray-400">
                                        Masukkan topik utama untuk menghasilkan struktur infografis.
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Sejarah Kopi"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                                        value={topicInput}
                                        onChange={(e) => setTopicInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAutoGenerateContent()}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                    />
                                </div>
                            )}

                            {autoGenMode === 'pdf' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm text-gray-400">Upload file PDF untuk dianalisis.</p>
                                    <PdfUpload 
                                        pdfData={uploadedPdf?.data || null}
                                        fileName={uploadedPdf?.name || null}
                                        onUpload={handlePdfUpload}
                                        onRemove={handlePdfRemove}
                                    />
                                </div>
                            )}

                            {autoGenMode === 'image' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-sm text-gray-400">Upload referensi visual untuk dianalisis.</p>
                                    <ImageAnalysisUpload 
                                        imageData={uploadedAnalysisImage ? { data: uploadedAnalysisImage.data, name: uploadedAnalysisImage.name } : null}
                                        onUpload={handleAnalysisImageUpload}
                                        onRemove={handleAnalysisImageRemove}
                                    />
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 space-y-4 mb-4">
                                    <div>
                                        <Checkbox
                                            id="carousel_mode"
                                            label="Excellent"
                                            checked={formData.enable_carousel}
                                            onChange={(e) => updateFormData('enable_carousel', e.target.checked)}
                                        />
                                        <p className="text-xs text-gray-500 mt-1 ml-6">
                                            Aktifkan untuk instruksi prompt yang lebih mendalam dan detail visual yang lebih kaya.
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-700/50">
                                        <Checkbox
                                            id="face_fix_mode"
                                            label="Akurasi Tinggi"
                                            checked={formData.enable_face_fix}
                                            onChange={(e) => updateFormData('enable_face_fix', e.target.checked)}
                                        />
                                        <p className="text-xs text-gray-500 ml-6 mt-1">Centang jika mengandung Tokoh Publik, Logo, atau Brand Terkenal.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAutoGenerateContent}
                                    disabled={isGeneratingText}
                                    className="w-full flex justify-center items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-600 shadow-blue-900/20"
                                >
                                    {isGeneratingText ? (
                                         <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menganalisis...
                                        </span>
                                    ) : (
                                         "Analisa & Generate"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Infographic Configuration */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300">
                        <div 
                            onClick={() => setIsConfigOpen(!isConfigOpen)}
                            className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-800/50 transition-colors border-b border-gray-800 bg-gray-900"
                        >
                            <h2 className="text-xl font-bold text-gray-200">Konfigurasi Infografis</h2>
                            <button 
                                className={`text-gray-400 hover:text-blue-400 transition-transform duration-300 ${isConfigOpen ? 'rotate-180' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>
                        
                        {isConfigOpen && (
                            <div className="p-6 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300 bg-gray-900">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select 
                                        label="Tujuan" 
                                        value={formData.purpose} 
                                        options={PURPOSE_OPTIONS}
                                        onChange={(val) => updateFormData('purpose', val)}
                                        placeholder="Pilih Tujuan..."
                                    />
                                    <Select
                                        label="Rasio"
                                        value={aspectRatio}
                                        options={[
                                            { value: '9:16', label: '9:16' },
                                            { value: '3:4', label: '3:4' },
                                            { value: '1:1', label: '1:1' },
                                            { value: '4:3', label: '4:3' },
                                            { value: '16:9', label: '16:9' }
                                        ]}
                                        onChange={setAspectRatio}
                                        placeholder="Pilih Rasio..."
                                    />
                                </div>

                                <VisualStyleSelector selectedStyle={visualStyle} onSelect={setVisualStyle} />
                                
                                <div className="space-y-4">
                                    <Input 
                                        id="title" 
                                        label="Judul Utama" 
                                        placeholder="Contoh: Sejarah Kopi" 
                                        value={formData.title}
                                        onChange={(e) => updateFormData('title', e.target.value)}
                                    />
                                    <Input 
                                        id="subtitle" 
                                        label="Subjudul" 
                                        placeholder="Penjelasan singkat..." 
                                        value={formData.subtitle}
                                        onChange={(e) => updateFormData('subtitle', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Textarea
                                        id="main_subject"
                                        label="Subjek Utama (Tokoh/Objek)"
                                        placeholder="Deskripsikan visual utama secara detail..."
                                        value={formData.main_subject}
                                        onChange={(e) => updateFormData('main_subject', e.target.value)}
                                        rows={3}
                                    />
                                    <Input 
                                        id="main_attribute" 
                                        label="Atribut Khusus" 
                                        placeholder="Pakaian, objek, warna..." 
                                        value={formData.main_attribute}
                                        onChange={(e) => updateFormData('main_attribute', e.target.value)}
                                    />
                                </div>

                                <SectionBuilder 
                                    sections={formData.sections}
                                    onChange={handleSectionChange}
                                    onAdd={addSection}
                                    onRemove={removeSection}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-blue-300 mb-2">Panel Tambahan</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <Checkbox 
                                            id="timeline" 
                                            label="Timeline" 
                                            checked={formData.enable_timeline}
                                            onChange={(e) => updateFormData('enable_timeline', e.target.checked)}
                                        />
                                        <Checkbox 
                                            id="map" 
                                            label="Lokasi" 
                                            checked={formData.enable_map}
                                            onChange={(e) => updateFormData('enable_map', e.target.checked)}
                                        />
                                        <Checkbox 
                                            id="factbox" 
                                            label="Fakta" 
                                            checked={formData.enable_factbox}
                                            onChange={(e) => updateFormData('enable_factbox', e.target.checked)}
                                        />
                                        <Checkbox 
                                            id="stats" 
                                            label="Statistik" 
                                            checked={formData.enable_statistics}
                                            onChange={(e) => updateFormData('enable_statistics', e.target.checked)}
                                        />
                                        <Checkbox 
                                            id="quote" 
                                            label="Kutipan" 
                                            checked={formData.enable_quote}
                                            onChange={(e) => updateFormData('enable_quote', e.target.checked)}
                                        />
                                        <Checkbox 
                                            id="qr_code" 
                                            label="QR Code" 
                                            checked={formData.enable_qr_code}
                                            onChange={(e) => updateFormData('enable_qr_code', e.target.checked)}
                                        />
                                    </div>
                                </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input 
                                        id="sources" 
                                        label="Sumber Data" 
                                        value={formData.sources}
                                        onChange={(e) => updateFormData('sources', e.target.value)}
                                    />
                                    <Input 
                                        id="brand" 
                                        label="Signature" 
                                        value={PERMANENT_BRAND_URL}
                                        readOnly
                                        className="opacity-75 cursor-not-allowed text-gray-400"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Preview & Output */}
                <div className="space-y-6 flex flex-col sticky top-24 self-start">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4 shadow-xl">
                         <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                             <h2 className="text-xl font-bold text-gray-200">Prompt Result</h2>
                         </div>

                         {generatedPrompt ? (
                             <PromptPreview 
                                prompt={generatedPrompt}
                                caption={generatedCaption}
                                formData={formData}
                                onSave={saveToHistory}
                                onShare={() => generateShareLink()}
                                onShareTemplate={(name) => generateShareLink(name)}
                                onOpenHistory={() => setIsHistoryOpen(true)}
                                historyCount={history.length}
                             />
                         ) : (
                             <div className="text-center text-gray-500 py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-50">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                 </svg>
                             </div>
                         )}
                    </div>
                    
                    <div className="bg-yellow-900/40 border border-yellow-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <h3 className="font-bold text-yellow-300">PERINGATAN</h3>
                        </div>
                        <p className="text-xs text-yellow-300/80 leading-relaxed">
                            DILARANG KERAS menjual, mendistribusikan, atau memanfaatkan tools ini untuk kepentingan komersial dalam bentuk apa pun tanpa izin tertulis dari Developer.
                            <br />
                            Segala bentuk pelanggaran akan diproses sesuai ketentuan yang berlaku.
                        </p>
                    </div>

                </div>
            </div>
        </main>

        <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm">
                    Copyright © 2026 R_besar.id | All rights reserved.
                </p>
            </div>
        </footer>

        <HistorySidebar 
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={history}
            onLoad={(item) => {
                setFormData({ ...item.data, brand_url: PERMANENT_BRAND_URL }); 
                setVisualStyle(item.visualStyle);
                setAspectRatio(item.aspectRatio);
                setIsHistoryOpen(false);
            }}
            onDelete={(id) => {
                const newHistory = history.filter(h => h.id !== id);
                setHistory(newHistory);
                localStorage.setItem('infographic_history', JSON.stringify(newHistory));
            }}
            onClear={() => {
                setHistory([]);
                localStorage.removeItem('infographic_history');
            }}
        />

        <AboutPage isOpen={isAboutPageOpen} onClose={() => setIsAboutPageOpen(false)} />
    </div>
  );
}