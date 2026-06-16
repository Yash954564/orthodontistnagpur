# Dr. Suryawanshi's Orthodontic & Dental Speciality Clinic Landing Page

A premium single-page landing website developed for Dr. Suryawanshi's Orthodontic & Dental Speciality Clinic, Nagpur.

## Features
- **3D Interactive Scene**: Embedded Three.js script rendering floating particles and a procedural tooth model responsive to cursor interaction.
- **GSAP ScrollTrigger**: Modern reveal effects and scrolling micro-animations across all major segments.
- **Conversion Optimization**: Sticky appointment bars, floating WhatsApp integration, exit-intent registration, and interactive Before & After slider.
- **SEO Ready**: Customized header tags, local business schemas (`seo/schema.json`), and XML sitemaps (`seo/sitemap.xml`).

## Project Structure
```
d:\orthodontistnagpur\orthodontistnagpur\
├── index.html                 # Main landing page markup
├── css/
│   ├── style.css              # Typography & layout styling
│   ├── animations.css         # Keyframes & hover effects
│   └── responsive.css         # Mobile/tablet responsiveness
├── js/
│   ├── main.js                # Page preloader & menu controls
│   ├── three-scene.js         # Three.js 3D backdrop scene
│   ├── animations.js          # GSAP scroll triggers & counters
│   └── forms.js               # Form validations & drag slider
├── assets/
│   ├── images/                # Copied images and clinical assets
│   └── icons/                 # Professional SVG definitions
└── seo/
    ├── schema.json            # JSON-LD Structured data
    └── sitemap.xml            # Search sitemap
```

## Setup & Local Run
Simply open `index.html` in any modern web browser, or use a local HTTP server such as VS Code Live Server or Python's HTTP server:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.
