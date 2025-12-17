
export const VISUAL_STYLES = [
    {
      value: 'vintage',
      label: 'Vintage Illustrative',
      prompt_fragment: 'vintage-illustrative masterpiece, sepia tone, high-detail hand-drawn etching on aged paper. The central visual is in an engraved style with cross-hatching shading. Emphasize symmetry, botanical ornaments (kamboja/melati/padi), and vintage typography.'
    },
    {
      value: 'modern_flat',
      label: 'Modern Flat Design',
      prompt_fragment: 'modern flat design masterpiece, vibrant brand colors, clean lines, minimalist icons, sans-serif typography. The central visual is a stylized flat vector illustration. Emphasize clarity, negative space, and a clean grid layout.'
    },
    {
      value: '3d_render',
      label: '3D Render (Clay/Glossy)',
      prompt_fragment: 'high-fidelity 3D render style, claymorphism or glossy plastic textures, soft studio lighting, pastel color palette, rounded shapes. The central visual is a cute but detailed 3D character or object. Emphasize depth, soft shadows, and a playful yet professional look.'
    },
    {
      value: '3d_realistic',
      label: '3D Realistis',
      prompt_fragment: 'hyper-realistic 3D render masterpiece, cinematic lighting, 8k resolution, photorealistic textures, ray-traced shadows. The central visual appears as a high-fidelity physical model or product shot. Emphasize material accuracy, atmospheric lighting, and depth of field.'
    },
    {
      value: 'futuristic',
      label: 'Futuristic / Cyberpunk',
      prompt_fragment: 'futuristic cyberpunk aesthetic, dark background with neon glowing lines (cyan, magenta), HUD interface elements, holographic data visualization. The central visual is a high-tech glowing wireframe or hologram. Emphasize technology, digital complexity, and high contrast.'
    },
    {
      value: 'glowing_neon',
      label: 'Glowing Neon / Synthwave',
      prompt_fragment: 'glowing neon art style, synthwave aesthetic, vibrant pink and cyan lights on dark grid background, retro-futuristic vibe. The central visual is outlined in bright neon tubes. Emphasize contrast, electricity, and 80s nostalgia.'
    },
    {
      value: 'watercolor',
      label: 'Watercolor Painting',
      prompt_fragment: 'artistic watercolor painting style, soft edges, color bleeding effects, textured paper background, handwritten-style typography. The central visual is a beautiful watercolor portrait/object with gentle washes of color. Emphasize artistry, organic shapes, and a light, airy feel.'
    },
    {
      value: 'blueprint',
      label: 'Technical Blueprint',
      prompt_fragment: 'technical blueprint style, white lines on a blue background, precise schematic diagrams, grid lines, and technical annotation typography. The central visual is a detailed technical drawing or exploded view. Emphasize precision, accuracy, and detailed annotations.'
    },
    {
      value: 'vintage_blueprint',
      label: 'Vintage Blueprint',
      prompt_fragment: 'vintage cyanotype blueprint style, worn dark blue paper texture, faded white technical lines, engineering schematics, grid overlay, aged edges. The central visual is a detailed technical diagram from the 19th century. Emphasize history, mechanical detail, and archival quality.'
    },
    {
      value: 'isometric',
      label: 'Isometric 3D',
      prompt_fragment: 'isometric 3D vector art, clean shadows, vibrant gradients, geometric shapes, and modern sans-serif typography. The central visual is a detailed 3D isometric illustration of the main subject. Emphasize depth, perspective, and a clean, tech-inspired aesthetic.'
    },
    {
      value: '3d_loaded',
      label: '3D Loaded View',
      prompt_fragment: '3D loaded view, isometric cutaway or knolling style, densely packed with detailed objects, high-fidelity rendering, vibrant colors, soft studio lighting. The central visual is a rich composition of many small elements forming a cohesive whole. Emphasize complexity, depth, and a toy-like matte finish.'
    },
    {
      value: 'paper_cutout',
      label: 'Paper Cutout Craft',
      prompt_fragment: 'digital paper cutout style, layered paper craft, soft drop shadows for depth, textured paper grain, vibrant but matte colors. The central visual is composed of stacked paper layers. Emphasize tactile feel, craft, and dimensionality.'
    },
    {
      value: 'pop_art',
      label: 'Pop Art Comic',
      prompt_fragment: 'pop art comic style, Roy Lichtenstein inspired, bold black outlines, vibrant primary colors, halftone dots pattern. The central visual is dynamic and expressive. Emphasize retro comic aesthetics and bold graphic impact.'
    },
    {
      value: 'wooden_carved',
      label: 'Wooden Carved',
      prompt_fragment: 'intricate wood carving style, bas-relief sculpture effect, realistic wood grain texture, warm lighting, handcrafted aesthetic. The central visual appears to be carved from solid wood with deep shadows and highlights. Emphasize texture, craftsmanship, and a rustic yet elegant feel.'
    },
    {
      value: 'chalkboard',
      label: 'Chalkboard Educational',
      prompt_fragment: 'chalkboard illustration style, white chalk texture on dark green slate, dusty effects, hand-drawn educational diagrams. The central visual looks like a professor\'s drawing. Emphasize learning, rustic texture, and hand-written elements.'
    },
    {
      value: 'pixel_art',
      label: 'Retro Pixel Art',
      prompt_fragment: '16-bit pixel art, retro video game aesthetic, crisp square pixels, limited color palette, dithering shading. The central visual is a sprite illustration. Emphasize nostalgia, digital precision, and arcade gaming feel.'
    },
    {
      value: 'claymation',
      label: 'Claymation / Stop Motion',
      prompt_fragment: 'stop-motion claymation style, plasticine texture, fingerprints visible, soft studio lighting, shallow depth of field. The central visual looks like a handmade clay model. Emphasize tactility, playfulness, and physical material.'
    },
    {
      value: 'minimalist_line_art',
      label: 'Minimalist Line Art',
      prompt_fragment: 'minimalist line art, single continuous line drawing, black and white, clean aesthetic, focus on form, no shading.'
    },
    {
      value: 'knitted_art',
      label: 'Knitted Art',
      prompt_fragment: 'knitted art style, realistic wool texture, intricate yarn loops, crochet patterns, soft studio lighting, cozy warm atmosphere. The central visual is crafted entirely from yarn with visible stitch details. Emphasize tactile texture, softness, and a handmade craft aesthetic.'
    },
    {
      value: 'abstract_geometric',
      label: 'Abstract Geometric',
      prompt_fragment: 'abstract geometric design, clean shapes, bold color blocking, minimalist aesthetic, vector art'
    },
];

export const PURPOSE_OPTIONS = [
    { value: 'education', label: 'Edukasi / Pembelajaran' },
    { value: 'marketing', label: 'Marketing / Promosi Produk' },
    { value: 'social_media', label: 'Konten Media Sosial (Viral)' },
    { value: 'report', label: 'Laporan Bisnis / Data' },
    { value: 'awareness', label: 'Kampanye Kesadaran Publik' },
    { value: 'history', label: 'Arsip Sejarah / Biografi' }
];

export const PROMPT_CONFIG = {
    "tool_name": "INFOGRAPHIC PROMPT BUILDER",
    "version": "2.2",
    "description": "Alat serbaguna untuk membuat prompt text-to-image untuk infografis dengan akurasi tinggi pada figur, brand, logo, dan detail visual.",
    "prompt_template": {
      "final_prompt_example_structure": "Generate a **professional, award-winning infographic** designed for {PURPOSE} in a {VISUAL_STYLE} style. \n\n**1. LAYOUT & COMPOSITION:**\n- Aspect Ratio: {ASPECT_RATIO}.\n- Composition: Use a clear visual hierarchy with a dominant central hero image and organized surrounding sections.\n\n**2. HEADER & TYPOGRAPHY:**\n- Title: \"{TITLE}\" (Render text with absolute precision, vector-sharp lines, no typos).\n- Subtitle: \"{SUBTITLE}\" (Clean, legible font).\n\n**3. CENTRAL HERO (CRITICAL DETAIL):**\n- Subject: {MAIN_SUBJECT}.\n- Attributes: {MAIN_ATTIRE_OR_ATTRIBUTE}.\n- **IDENTITY & BRAND PRESERVATION (CRITICAL):** \n  - **People:** If a public figure is mentioned, you **MUST generate a recognizable likeness**. Prioritize facial accuracy.\n  - **Logos/Brands:** If a specific Band Logo, Government Emblem, or Product Brand is mentioned, render it with **high fidelity to the official design**. Use official brand colors (hex-accurate), correct geometry, and correct spelling.\n\n**4. CONTENT SECTIONS:**\nCreate structured visual blocks for the following content:\n{SECTION_LIST}\n\n**5. SIDE PANELS:**\nInclude: {SIDE_PANELS}.\n\n**6. BRANDING & FOOTER:**\n- Sources: \"{SOURCES}\" (Legible small text).\n- Footer Signature: \"{BRAND_URL}\" (Render as **PLAIN TEXT ONLY**. DO NOT generate any logo, icon, or emblem for this URL. Just the text).\n\n**7. QUALITY & AESTHETICS:**\n- 8k resolution, highly detailed, professional graphic design, cinematic lighting, sharp focus, masterpiece quality. \n- {QUALITY_BOOSTERS}",
      "carousel_structure": {
          "base_instruction": "Generate a **social media carousel slide {SLIDE_NUM} of 5** in {VISUAL_STYLE} style for topic \"{TITLE}\". Aspect Ratio: {ASPECT_RATIO}. Keep visual consistency (same character/colors) across all slides. 8k resolution, masterpiece.",
          "slides": [
              {
                  "type": "COVER",
                  "content": "Focus on the **Hero Image** of {MAIN_SUBJECT} ({MAIN_ATTIRE_OR_ATTRIBUTE}). Big Bold Title: \"{TITLE}\". Subtitle: \"{SUBTITLE}\". Make it catchy and viral-worthy. **IDENTITY PRESERVATION:** Ensure **perfect facial likeness** for figures and **accurate logo/branding** for products."
              },
              {
                  "type": "CONTENT_1",
                  "content": "Visual illustration for: {SECTION_1_TITLE}. Text bullet points: {SECTION_1_TEXT}. maintain theme."
              },
              {
                  "type": "CONTENT_2",
                  "content": "Visual illustration for: {SECTION_2_TITLE} and {SECTION_3_TITLE}. Text points: {SECTION_2_TEXT} / {SECTION_3_TEXT}. maintain theme."
              },
              {
                  "type": "DETAIL",
                  "content": "Close-up or detailed data visualization. {SIDE_PANELS}. If no data, focus on artistic detail of {MAIN_SUBJECT}. maintain theme."
              },
              {
                  "type": "OUTRO",
                  "content": "Conclusion slide. Summary text. Sources: \"{SOURCES}\". Prominent footer signature/URL: \"{BRAND_URL}\" (**TEXT ONLY**, NO LOGO). Call to Action visual."
              }
          ]
      }
    },
    "layout_structure": {
      "sections": {
        "max_sections": 8
      }
    },
    "example_outputs": [
      {
        "example_id": "soekarno_sample",
        "input": {
          "title": "SOEKARNO: Dari Insinyur Hingga Proklamator",
          "subtitle": "Menggali Detail Biografi & Visual Kunci Arsitek Bangsa",
          "main_subject": "Soekarno, berdiri, setengah badan, mengenakan seragam safari, mengenakan peci nasional, ekspresi tegas dan karismatik",
          "main_attribute": "peci_nasional, jam_tangan_kecil, seragam_safari, sabuk_serbaguna",
          "sections": [
            {"title": "Ideologi & Lambang Bangsa", "text": "17 helai bulu pada sayap; 45 helai bulu pada leher; 8 helai bulu pada ekor", "visual_hint": "garuda_lambang"},
            {"title": "Pendidikan & Arsitektur", "text": "Technische Hoogeschool (THS) Bandung - 1926; Insinyur Arsitek", "visual_hint": "gedung_pendidikan, diploma_roll"},
            {"title": "Proklamasi Kemerdekaan", "text": "17 Agustus 1945 - Pembacaan Proklamasi; Kolaborasi Soekarno-Hatta", "visual_hint": "mikrofon_podium, dokumen_proklamasi"}
          ],
          "sources": ["Arsip Nasional RI", "Kementerian Pendidikan & Kebudayaan"],
          "brand_url": "lynk.id/r_besar.id"
        }
      }
    ]
  };
