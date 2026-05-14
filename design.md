<!-- TechFactory Database Portal -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>TechFactory Machine Database</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&amp;family=Inter:wght@100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
                  "surface-container-low": "#f3f3f3",
                  "on-primary-container": "#fefdff",
                  "on-primary": "#ffffff",
                  "on-primary-fixed-variant": "#004b71",
                  "primary-fixed-dim": "#8ecdff",
                  "outline-variant": "#bfc7d1",
                  "on-secondary-container": "#576474",
                  "on-surface-variant": "#3f4850",
                  "surface-container": "#eeeeee",
                  "surface-tint": "#006494",
                  "outline": "#707881",
                  "on-error": "#ffffff",
                  "surface-dim": "#dadada",
                  "on-error-container": "#93000a",
                  "error": "#ba1a1a",
                  "on-secondary": "#ffffff",
                  "secondary-container": "#d4e1f5",
                  "surface": "#f9f9f9",
                  "inverse-on-surface": "#f0f1f1",
                  "surface-variant": "#e2e2e2",
                  "on-tertiary-fixed-variant": "#7a3000",
                  "tertiary-container": "#c55100",
                  "primary-container": "#007cb6",
                  "surface-container-highest": "#e2e2e2",
                  "secondary-fixed-dim": "#bbc7db",
                  "on-background": "#1a1c1c",
                  "tertiary-fixed": "#ffdbcc",
                  "on-tertiary-fixed": "#351000",
                  "primary": "#006291",
                  "surface-container-lowest": "#ffffff",
                  "background": "#f9f9f9",
                  "inverse-primary": "#8ecdff",
                  "on-tertiary-container": "#fffdff",
                  "surface-bright": "#f9f9f9",
                  "on-secondary-fixed-variant": "#3c4858",
                  "secondary": "#535f70",
                  "inverse-surface": "#2f3131",
                  "tertiary-fixed-dim": "#ffb693",
                  "on-tertiary": "#ffffff",
                  "on-primary-fixed": "#001e30",
                  "error-container": "#ffdad6",
                  "secondary-fixed": "#d7e3f7",
                  "on-surface": "#1a1c1c",
                  "tertiary": "#9d3f00",
                  "on-secondary-fixed": "#101c2b",
                  "primary-fixed": "#cbe6ff",
                  "surface-container-high": "#e8e8e8"
          },
          "borderRadius": {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
          },
          "spacing": {
                  "margin-desktop": "64px",
                  "gutter": "24px",
                  "lg": "48px",
                  "margin-mobile": "20px",
                  "base": "4px",
                  "xs": "8px",
                  "md": "24px",
                  "xl": "80px",
                  "sm": "16px"
          },
          "fontFamily": {
                  "label-caps": [
                          "JetBrains Mono"
                  ],
                  "body-md": [
                          "Inter"
                  ],
                  "headline-md": [
                          "Hanken Grotesk"
                  ],
                  "display-xl": [
                          "Hanken Grotesk"
                  ],
                  "headline-lg-mobile": [
                          "Hanken Grotesk"
                  ],
                  "body-lg": [
                          "Inter"
                  ],
                  "headline-lg": [
                          "Hanken Grotesk"
                  ],
                  "body-sm": [
                          "Inter"
                  ]
          },
          "fontSize": {
                  "label-caps": [
                          "12px",
                          {
                                  "lineHeight": "16px",
                                  "letterSpacing": "0.05em",
                                  "fontWeight": "600"
                          }
                  ],
                  "body-md": [
                          "16px",
                          {
                                  "lineHeight": "24px",
                                  "fontWeight": "400"
                          }
                  ],
                  "headline-md": [
                          "24px",
                          {
                                  "lineHeight": "32px",
                                  "fontWeight": "700"
                          }
                  ],
                  "display-xl": [
                          "48px",
                          {
                                  "lineHeight": "56px",
                                  "letterSpacing": "-0.02em",
                                  "fontWeight": "800"
                          }
                  ],
                  "headline-lg-mobile": [
                          "28px",
                          {
                                  "lineHeight": "36px",
                                  "fontWeight": "700"
                          }
                  ],
                  "body-lg": [
                          "18px",
                          {
                                  "lineHeight": "28px",
                                  "fontWeight": "400"
                          }
                  ],
                  "headline-lg": [
                          "32px",
                          {
                                  "lineHeight": "40px",
                                  "fontWeight": "700"
                          }
                  ],
                  "body-sm": [
                          "14px",
                          {
                                  "lineHeight": "20px",
                                  "fontWeight": "400"
                          }
                  ]
          }
  },
      },
    }
  </script>
</head>
<body class="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="hidden md:flex flex-col w-full sticky top-0 z-50 bg-secondary dark:bg-on-secondary-fixed-variant transition-all duration-200 ease-in-out border-b border-outline-variant shadow-sm">
<div class="flex justify-between items-center w-full px-margin-desktop py-4">
<div class="flex items-center gap-xl">
<a class="font-headline-md text-headline-md font-bold text-on-primary tracking-tight flex items-center gap-2" href="#">
<span class="material-symbols-outlined">database</span>
  TechFactory DB
</a>
<div class="flex gap-md font-label-caps text-label-caps">
<a class="text-on-primary border-b-2 border-on-primary pb-1 font-bold" href="#">Inventory</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors pb-1" href="#">Specifications</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors pb-1" href="#">Maintenance</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors pb-1" href="#">CMS</a>
</div>
</div>
<div class="flex items-center gap-sm">
<button class="p-xs text-on-primary hover:bg-secondary-fixed-variant/20 rounded-full transition-colors flex items-center justify-center">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<button class="p-xs text-on-primary hover:bg-secondary-fixed-variant/20 rounded-full transition-colors flex items-center justify-center">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</nav>
<!-- Hero Section (Utility Focused) -->
<header class="bg-surface-container-lowest border-b border-outline-variant py-xl relative overflow-hidden">
<div class="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
<img alt="" class="w-full h-full object-cover object-left" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiAvdr4mbHapzNJrHXe7YS_sVNS-se2H9BNwp8gETksplLlegVRr6PnTekCk6tw6rqMOe1DnyJfWPPVxP0fPy-XGcxDnbErswdmYrwypptmT6xFoO_t07SuAoJRHUd7WpQbx8s8p6vE8ACcYRUsGEWSi4K6vl1lnI_WfOgXJA5V9i0DtXmxU81eK-JuNwIqhU1KD6C8eyFVl_NHR8lCJGyoEskhrT4FzObGwEtshiAB2l-IPv_0ZH3PZ-twhlP5K9AgarkdxfaafU"/>
</div>
<div class="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl relative z-10">
<div class="max-w-3xl mb-lg">
<h1 class="font-display-xl text-display-xl text-on-surface mb-xs tracking-tight">Machinery Directory</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Query comprehensive technical specifications, working principles, and maintenance logs across all factory assets.</p>
</div>
<!-- Search and Filter Bar -->
<div class="bg-surface p-md border border-outline-variant rounded-DEFAULT shadow-sm flex flex-col md:flex-row gap-sm items-end">
<div class="w-full flex-1">
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Search Database</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full pl-xl pr-sm py-2 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-DEFAULT font-body-md text-on-surface transition-colors placeholder:text-outline" placeholder="Enter Model, Serial, or Keyword..." type="text"/>
</div>
</div>
<div class="w-full md:w-48">
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Manufacturer</label>
<select class="w-full px-sm py-2 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-DEFAULT font-body-md text-on-surface transition-colors appearance-none">
<option value="">All Brands</option>
<option value="juki">JUKI</option>
<option value="hashima">Hashima</option>
</select>
</div>
<div class="w-full md:w-48">
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Category</label>
<select class="w-full px-sm py-2 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-DEFAULT font-body-md text-on-surface transition-colors appearance-none">
<option value="">All Categories</option>
<option value="heavy">Heavy-Duty</option>
<option value="medium">Medium-Duty</option>
<option value="control">Control Panels</option>
</select>
</div>
<button class="w-full md:w-auto bg-primary text-on-primary font-label-caps text-label-caps px-lg py-2 rounded-DEFAULT hover:bg-primary-container transition-colors uppercase whitespace-nowrap h-[42px] flex items-center justify-center gap-xs">
<span class="material-symbols-outlined text-[18px]">filter_list</span>
  Filter
</button>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="container mx-auto px-margin-mobile md:px-margin-desktop py-xl max-w-7xl">
<!-- Section: Categories -->
<section class="mb-xl">
<h2 class="font-headline-md text-headline-md text-on-surface mb-md">Browse by Category</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-sm">
<a class="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT hover:border-primary hover:shadow-sm transition-all group flex items-center gap-sm" href="#">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">precision_manufacturing</span>
</div>
<div>
<span class="block font-body-md font-bold text-on-surface">Sewing Heads</span>
<span class="block font-body-sm text-outline">84 Items</span>
</div>
</a>
<a class="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT hover:border-primary hover:shadow-sm transition-all group flex items-center gap-sm" href="#">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">memory</span>
</div>
<div>
<span class="block font-body-md font-bold text-on-surface">Controllers</span>
<span class="block font-body-sm text-outline">22 Items</span>
</div>
</a>
<a class="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT hover:border-primary hover:shadow-sm transition-all group flex items-center gap-sm" href="#">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">settings_applications</span>
</div>
<div>
<span class="block font-body-md font-bold text-on-surface">Motors &amp; Drives</span>
<span class="block font-body-sm text-outline">45 Items</span>
</div>
</a>
<a class="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT hover:border-primary hover:shadow-sm transition-all group flex items-center gap-sm" href="#">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">build</span>
</div>
<div>
<span class="block font-body-md font-bold text-on-surface">Maintenance Kits</span>
<span class="block font-body-sm text-outline">18 Items</span>
</div>
</a>
</div>
</section>
<!-- Section: Recently Added -->
<section>
<div class="flex justify-between items-end mb-md border-b border-outline-variant pb-sm">
<h2 class="font-headline-md text-headline-md text-on-surface">Recently Added Records</h2>
<a class="text-primary font-label-caps text-label-caps hover:underline flex items-center gap-1" href="#">View All <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
<!-- Compact Card 1 -->
<a class="group bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col rounded-DEFAULT overflow-hidden" href="#">
<div class="h-40 bg-surface-container-low relative border-b border-outline-variant p-sm flex items-center justify-center">
<img class="w-full h-full object-contain mix-blend-multiply" data-alt="Complex industrial sewing machine head." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMkfrxuIT8ZvH5NWV7O0s9RwcbIHLnWrwge1H7aZ3mae2yaZO0MXPh8oD_LoZNAdinnqTvq1Bbj17p3BQxOe2c0lM94bqaXv-MkeFGXL4Mg8Dn7LvQxfv4uEcHEjyXtjhcPD8KdoBkqSwu2HxRH8WJYQuLFLCeYAWUek9ePviT3-TZRfypUD6GLBWrLop4Gl55H4HKo2I6engTrJVG3ZXXh7WjT2GDw42k51SNiCISVWXECrvkbj_0OEsAM5Ux_-Vo5Dc5fOkhApc"/>
<div class="absolute top-sm right-sm bg-surface-container-lowest border border-outline-variant px-2 py-1 font-label-caps text-[10px] text-on-surface rounded-sm">JUKI</div>
</div>
<div class="p-md flex-1 flex flex-col">
<div class="flex justify-between items-start mb-xs">
<h3 class="font-body-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">AMS-210EN HL 1306 SZZ</h3>
</div>
<p class="font-body-sm text-on-surface-variant mb-md line-clamp-2 flex-1">Computer-Controlled Cycle Machine for Heavy-Weight Materials.</p>
<div class="bg-surface rounded p-xs border border-outline-variant grid grid-cols-2 gap-2 mt-auto">
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Area</span>
<span class="block text-body-sm font-medium text-on-surface">130x60mm</span>
</div>
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Max Speed</span>
<span class="block text-body-sm font-medium text-on-surface">2,800 sti/min</span>
</div>
</div>
</div>
</a>
<!-- Compact Card 2 -->
<a class="group bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col rounded-DEFAULT overflow-hidden" href="#">
<div class="h-40 bg-surface-container-low relative border-b border-outline-variant p-sm flex items-center justify-center">
<img class="w-full h-full object-contain mix-blend-multiply" data-alt="Industrial control panel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmjcmPKv8Rx773K6RNifiDzXhsHIUGh8TPtZU4Ew4_gGFC0AFnEURh9gkAZrrCQtFTw3C7l5OiaSVMRw53hKWwAVjTTnByuENoFGMPa0C9bBIm5fnFpPdVPKQD17tKSdNLDKFdolv2OA58jsHJW-hvr91of-RQa1oWF5yaq0cTDU3oSUdq_35MUBYTTiaSHK8kgC3rKn1oNKMDOlIvFm6tWidQ-VLC54Rqfnh6ZGbwzg3sd6EQubsT7K8D-QUCsDDpqWg5pA24Qgc"/>
<div class="absolute top-sm right-sm bg-surface-container-lowest border border-outline-variant px-2 py-1 font-label-caps text-[10px] text-on-surface rounded-sm">JUKI</div>
</div>
<div class="p-md flex-1 flex flex-col">
<div class="flex justify-between items-start mb-xs">
<h3 class="font-body-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">AMS-210EN SS Panel</h3>
</div>
<p class="font-body-sm text-on-surface-variant mb-md line-clamp-2 flex-1">Standard specification control interface for medium-weight systems.</p>
<div class="bg-surface rounded p-xs border border-outline-variant grid grid-cols-2 gap-2 mt-auto">
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Interface</span>
<span class="block text-body-sm font-medium text-on-surface">Touch LCD</span>
</div>
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Compatibility</span>
<span class="block text-body-sm font-medium text-on-surface">EN Series</span>
</div>
</div>
</div>
</a>
<!-- Compact Card 3 -->
<a class="group bg-surface-container-lowest border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col rounded-DEFAULT overflow-hidden" href="#">
<div class="h-40 bg-surface-container-low relative border-b border-outline-variant p-sm flex items-center justify-center">
<img class="w-full h-full object-contain mix-blend-multiply" data-alt="Mechanical gears and stepping motors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLACPEfPweGvmvAybgz4l32LvM9aog9WMXQJ48LFxu3RDSfGVE4tKHnObXosUpzxpI0jIENlN_rBF4yWMAYPsrmRT3DzvjPn9jYvFLsrUzzhQQ5CxJkrBbq6PN68moXyor5LdAXQ2_TT3zyvZJ4ha9UynRn2g7NFAPW7QVVS5W8J_zNbHfCeYrEzBQU5uW0X1Dc8zJW4Wdhji8Bkb0OrfeB2wtRQUjh42BxT0TI876-GGhekgnkvTM7l92s3FC8iOAIqjBBGgDK5I"/>
<div class="absolute top-sm right-sm bg-surface-container-lowest border border-outline-variant px-2 py-1 font-label-caps text-[10px] text-on-surface rounded-sm">HASHIMA</div>
</div>
<div class="p-md flex-1 flex flex-col">
<div class="flex justify-between items-start mb-xs">
<h3 class="font-body-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">HSM-3020 Drive Unit</h3>
</div>
<p class="font-body-sm text-on-surface-variant mb-md line-clamp-2 flex-1">Large area programmable pattern tacker drive assembly.</p>
<div class="bg-surface rounded p-xs border border-outline-variant grid grid-cols-2 gap-2 mt-auto">
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Area Support</span>
<span class="block text-body-sm font-medium text-on-surface">300x200mm</span>
</div>
<div>
<span class="block text-[10px] text-outline font-label-caps uppercase">Max Speed</span>
<span class="block text-body-sm font-medium text-on-surface">2,500 sti/min</span>
</div>
</div>
</div>
</a>
</div>
</section>
<!-- Quick Action / Add Card -->
<div class="mt-xl bg-surface-container-low border border-dashed border-outline-variant p-lg flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors cursor-pointer rounded-DEFAULT">
<div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-sm">
<span class="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<h4 class="font-headline-md text-[20px] text-on-surface mb-xs">Submit New Record</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">Authorized engineering personnel can submit new machine specifications for database entry.</p>
</div>
</main>
<!-- Footer -->
<footer class="bg-secondary dark:bg-on-secondary-fixed border-t border-outline-variant mt-xl">
<div class="container mx-auto max-w-7xl">
<div class="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-xl gap-lg md:gap-0">
<div class="text-center md:text-left">
<span class="font-headline-md text-headline-md font-black text-on-primary block mb-xs flex items-center justify-center md:justify-start gap-2">
<span class="material-symbols-outlined">database</span> TechFactory DB
</span>
<span class="font-body-sm text-body-sm text-on-secondary dark:text-secondary-fixed max-w-sm block">© 2024 Industrial Systems Database. All rights reserved. Technical documentation intended for professional use.</span>
</div>
<div class="flex flex-wrap justify-center md:justify-end gap-x-md gap-y-sm font-body-sm text-body-sm">
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Privacy Policy</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Terms of Service</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Archive</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Contact Engineering</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Global Standards</a>
</div>
</div>
</div>
</footer>
</body></html>

<!-- JUKI AMS-210EN Technical Specifications -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>JUKI AMS-210EN HL 1306 SZZ - Technical Research Report</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;700;800&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@600&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-container-low": "#f3f3f3",
                        "on-primary-container": "#fefdff",
                        "on-primary": "#ffffff",
                        "on-primary-fixed-variant": "#004b71",
                        "primary-fixed-dim": "#8ecdff",
                        "outline-variant": "#bfc7d1",
                        "on-secondary-container": "#576474",
                        "on-surface-variant": "#3f4850",
                        "surface-container": "#eeeeee",
                        "surface-tint": "#006494",
                        "outline": "#707881",
                        "on-error": "#ffffff",
                        "surface-dim": "#dadada",
                        "on-error-container": "#93000a",
                        "error": "#ba1a1a",
                        "on-secondary": "#ffffff",
                        "secondary-container": "#d4e1f5",
                        "surface": "#f9f9f9",
                        "inverse-on-surface": "#f0f1f1",
                        "surface-variant": "#e2e2e2",
                        "on-tertiary-fixed-variant": "#7a3000",
                        "tertiary-container": "#c55100",
                        "primary-container": "#007cb6",
                        "surface-container-highest": "#e2e2e2",
                        "secondary-fixed-dim": "#bbc7db",
                        "on-background": "#1a1c1c",
                        "tertiary-fixed": "#ffdbcc",
                        "on-tertiary-fixed": "#351000",
                        "primary": "#006291",
                        "surface-container-lowest": "#ffffff",
                        "background": "#f9f9f9",
                        "inverse-primary": "#8ecdff",
                        "on-tertiary-container": "#fffdff",
                        "surface-bright": "#f9f9f9",
                        "on-secondary-fixed-variant": "#3c4858",
                        "secondary": "#535f70",
                        "inverse-surface": "#2f3131",
                        "tertiary-fixed-dim": "#ffb693",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed": "#001e30",
                        "error-container": "#ffdad6",
                        "secondary-fixed": "#d7e3f7",
                        "on-surface": "#1a1c1c",
                        "tertiary": "#9d3f00",
                        "on-secondary-fixed": "#101c2b",
                        "primary-fixed": "#cbe6ff",
                        "surface-container-high": "#e8e8e8"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "margin-desktop": "64px",
                        "gutter": "24px",
                        "lg": "48px",
                        "margin-mobile": "20px",
                        "base": "4px",
                        "xs": "8px",
                        "md": "24px",
                        "xl": "80px",
                        "sm": "16px"
                    },
                    fontFamily: {
                        "label-caps": ["JetBrains Mono"],
                        "body-md": ["Inter"],
                        "headline-md": ["Hanken Grotesk"],
                        "display-xl": ["Hanken Grotesk"],
                        "headline-lg-mobile": ["Hanken Grotesk"],
                        "body-lg": ["Inter"],
                        "headline-lg": ["Hanken Grotesk"],
                        "body-sm": ["Inter"]
                    },
                    fontSize: {
                        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
                        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
                        "display-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }],
                        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
                        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
                        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-surface text-on-surface font-body-md min-h-screen flex flex-col relative">
<!-- TopNavBar -->
<nav class="bg-secondary dark:bg-on-secondary-fixed-variant flex justify-between items-center w-full px-margin-desktop py-4 border-b border-outline-variant sticky top-0 z-50">
<div class="flex items-center gap-gutter">
<div class="text-headline-md font-headline-md font-bold text-on-primary">TechFactory Database</div>
<div class="hidden md:flex gap-md ml-lg">
<a class="text-secondary-fixed hover:text-on-primary transition-colors font-label-caps text-label-caps hover:bg-secondary-fixed-variant/20 px-xs py-base rounded" href="#">Databases</a>
<a class="text-on-primary border-b-2 border-on-primary pb-1 font-bold font-label-caps text-label-caps hover:bg-secondary-fixed-variant/20 px-xs py-base rounded" href="#">Specifications</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors font-label-caps text-label-caps hover:bg-secondary-fixed-variant/20 px-xs py-base rounded" href="#">Working Principles</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors font-label-caps text-label-caps hover:bg-secondary-fixed-variant/20 px-xs py-base rounded" href="#">Maintenance</a>
<a class="text-secondary-fixed hover:text-on-primary transition-colors font-label-caps text-label-caps hover:bg-secondary-fixed-variant/20 px-xs py-base rounded" href="#">Reports</a>
</div>
</div>
<div class="flex items-center gap-sm text-on-primary dark:text-primary-fixed-dim">
<button class="p-xs hover:bg-secondary-fixed-variant/20 rounded transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">settings</span>
</button>
<button class="p-xs hover:bg-secondary-fixed-variant/20 rounded transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</nav>
<!-- Main Container -->
<div class="w-full max-w-7xl mx-auto px-margin-desktop py-lg flex flex-col md:flex-row gap-xl items-start">
<!-- Sidebar Navigation -->
<aside class="w-full md:w-64 shrink-0 sticky top-[100px] hidden md:flex flex-col gap-md">
<div class="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col gap-sm">
<h3 class="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider border-b border-outline-variant pb-xs mb-xs">Contents</h3>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#overview">Overview</a>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#technical-data">Technical Data</a>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#working-principle">Working Principle</a>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#sequence-flow">Sequence Flow</a>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#parts-list">Parts List</a>
<a class="font-body-md text-body-md text-on-surface hover:text-primary transition-colors py-1" href="#maintenance">Maintenance</a>
</div>
<button class="w-full bg-primary text-on-primary font-body-md text-body-md font-bold px-md py-sm rounded flex items-center justify-center gap-xs hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
<span class="material-symbols-outlined text-[20px]">download</span>
            Download PDF
        </button>
</aside>
<!-- Content Area -->
<main class="flex-grow flex flex-col gap-xl w-full min-w-0">
<!-- Header Section -->
<header class="flex flex-col gap-md">
<h1 class="font-display-xl text-display-xl text-primary">JUKI AMS-210EN HL 1306 SZZ</h1>
<p class="font-headline-lg text-headline-lg text-on-surface-variant">Computer-Controlled Cycle Machine for Heavy-Weight Materials</p>
<div class="w-full h-[400px] bg-surface-container-high rounded border border-outline-variant flex items-center justify-center overflow-hidden">
<img alt="Technical illustration" class="w-full h-full object-cover opacity-80 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKjLn3puCcpcYxbN-BvUamASPEDka-sK60wUNbxQl74OLYgzaz2QFFBnua6aSt972GO-GmwRw0EUcMCu8axCQ_FgkCSb7uPgKPHlgT505dG6VONu-BSrJtjNrc3zxVR9LgXs3yX10cTtcrk-Q_LJtmNl6fyaMTitr4P6K4mZXhuRDkQ1gqmpGnFsIv3i1mXYh4joLvE_RDGB94CVfYOuKzZ77BangW5eQ3SGJ5MFjJjx2kfipz9BApb6GYQJqj9x8JVlnY7DdIPrs"/>
</div>
</header>
<!-- Section 1: Machine Overview & Classification -->
<section class="flex flex-col gap-md scroll-mt-24" id="overview">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Machine Overview</h2>
<p class="font-body-lg text-body-lg text-on-surface">The JUKI AMS-210EN HL 1306 SZZ is a high-speed, computer-controlled cycle sewing system manufactured by JUKI Corporation. The "EN" series signifies "Energy-saving" and "Next-generation" architecture, featuring a main-shaft direct-drive system and advanced electronic control. This specific configuration is optimized for medium-to-heavy weight materials and features a pneumatic material clamping system.</p>
<div class="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden mt-sm">
<table class="w-full text-left border-collapse">
<thead class="bg-secondary text-on-primary font-label-caps text-label-caps">
<tr>
<th class="p-sm border-b border-outline-variant w-1/3">Field</th>
<th class="p-sm border-b border-outline-variant">Information</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-on-surface">
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<td class="p-sm font-semibold">Machine Name</td>
<td class="p-sm">Computer-controlled Cycle Machine with Input Function</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container">
<td class="p-sm font-semibold">Brand / Manufacturer</td>
<td class="p-sm">JUKI Corporation (Japan)</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<td class="p-sm font-semibold">Model Series</td>
<td class="p-sm">AMS-210EN (EN Series)</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container">
<td class="p-sm font-semibold">Application Class</td>
<td class="p-sm">Medium- to Heavy-weight ("H" specification)</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<td class="p-sm font-semibold">Feeding Frame</td>
<td class="p-sm">Pneumatic separately-driven type ("L" specification)</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container">
<td class="p-sm font-semibold">Sewing Area</td>
<td class="p-sm">130mm (X) × 60mm (Y)</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container-lowest">
<td class="p-sm font-semibold">Drive System</td>
<td class="p-sm">550W AC Servomotor (Direct-Drive)</td>
</tr>
<tr class="bg-surface-container">
<td class="p-sm font-semibold">Control Panel</td>
<td class="p-sm">IP-420 Color LCD Touch Panel (Standard)</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- Section 2: Technical Specifications Grid -->
<section class="flex flex-col gap-md scroll-mt-24" id="technical-data">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Technical Data</h2>
<div class="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
<tr>
<th class="p-sm border-b border-outline-variant border-r">Parameter</th>
<th class="p-sm border-b border-outline-variant border-r">Value</th>
<th class="p-sm border-b border-outline-variant border-r">Parameter</th>
<th class="p-sm border-b border-outline-variant">Value</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-on-surface">
<tr class="border-b border-outline-variant">
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Max. Sewing Speed</td>
<td class="p-sm border-r border-outline-variant font-bold">2,800 sti/min</td>
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Stitch Length</td>
<td class="p-sm font-bold">0.1 to 12.7mm (0.05mm steps)</td>
</tr>
<tr class="border-b border-outline-variant">
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Needle Bar Stroke</td>
<td class="p-sm border-r border-outline-variant font-bold">41.2mm (H-spec)</td>
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Intermediate Presser Lift</td>
<td class="p-sm font-bold">20mm</td>
</tr>
<tr>
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Needle Specification</td>
<td class="p-sm border-r border-outline-variant font-bold">DP×17 (#18 to #25)</td>
<td class="p-sm font-semibold border-r border-outline-variant bg-surface-container-low text-secondary">Power Consumption</td>
<td class="p-sm font-bold">450VA</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- Section 3: Working Principle -->
<section class="flex flex-col gap-md scroll-mt-24" id="working-principle">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Working Principle</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div class="bg-surface-container-low p-md rounded border border-outline-variant">
<h3 class="font-headline-md text-headline-md text-secondary mb-sm">1. Direct-Drive Mechanism</h3>
<p class="font-body-md text-body-md">The machine utilizes a 550W AC servomotor mounted directly to the main shaft. This eliminates belt-slip and provides instantaneous acceleration and deceleration.</p>
</div>
<div class="bg-surface-container-low p-md rounded border border-outline-variant">
<h3 class="font-headline-md text-headline-md text-secondary mb-sm">2. Encoder-Controlled Feed</h3>
<p class="font-body-md text-body-md">Uses an encoder-control system continuously monitoring the position of X and Y feed tables. Increases power to stepping motors upon detecting resistance.</p>
</div>
<div class="bg-surface-container-low p-md rounded border border-outline-variant">
<h3 class="font-headline-md text-headline-md text-secondary mb-sm">3. Active Tension</h3>
<p class="font-body-md text-body-md">Needle thread tension is electronically controlled on a stitch-by-stitch basis, allowing pinpoint changes for varying material thicknesses.</p>
</div>
<div class="bg-surface-container-low p-md rounded border border-outline-variant">
<h3 class="font-headline-md text-headline-md text-secondary mb-sm">4. Programmable Presser</h3>
<p class="font-body-md text-body-md">To prevent "flagging", the lower dead point of the intermediate presser can be adjusted steplessly via the operation panel.</p>
</div>
</div>
</section>
<!-- Section 4: Sequence Flow -->
<section class="flex flex-col gap-md scroll-mt-24" id="sequence-flow">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Operational Sequence</h2>
<div class="bg-surface-container-lowest p-lg rounded border border-outline-variant overflow-x-auto">
<div class="min-w-[600px] flex items-center justify-between relative">
<!-- Connecting Line -->
<div class="absolute top-1/2 left-0 w-full h-1 bg-outline-variant -translate-y-1/2 z-0"></div>
<!-- Steps -->
<div class="relative z-10 flex flex-col items-center gap-sm bg-surface-container-lowest px-sm">
<div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-sm">1</div>
<div class="text-center">
<h4 class="font-bold text-on-surface">Material Set</h4>
<span class="text-body-sm text-on-surface-variant">Clamp engagement</span>
</div>
</div>
<div class="relative z-10 flex flex-col items-center gap-sm bg-surface-container-lowest px-sm">
<div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-sm">2</div>
<div class="text-center">
<h4 class="font-bold text-on-surface">Pattern Call</h4>
<span class="text-body-sm text-on-surface-variant">Data read from memory</span>
</div>
</div>
<div class="relative z-10 flex flex-col items-center gap-sm bg-surface-container-lowest px-sm">
<div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-sm">3</div>
<div class="text-center">
<h4 class="font-bold text-on-surface">Cycle Start</h4>
<span class="text-body-sm text-on-surface-variant">Feed &amp; needle actuation</span>
</div>
</div>
<div class="relative z-10 flex flex-col items-center gap-sm bg-surface-container-lowest px-sm">
<div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-sm">4</div>
<div class="text-center">
<h4 class="font-bold text-on-surface">Trim &amp; Release</h4>
<span class="text-body-sm text-on-surface-variant">Thread cut, clamp open</span>
</div>
</div>
</div>
</div>
</section>
<!-- Section 5: Parts List -->
<section class="flex flex-col gap-md scroll-mt-24" id="parts-list">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Key Parts List</h2>
<div class="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
<tr>
<th class="p-sm border-b border-outline-variant w-32">Part No.</th>
<th class="p-sm border-b border-outline-variant">Description</th>
<th class="p-sm border-b border-outline-variant w-24 text-right">Qty</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-on-surface">
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-sm font-mono text-secondary">B1401-210-A00</td>
<td class="p-sm">Needle Bar (H-type)</td>
<td class="p-sm text-right">1</td>
</tr>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-sm font-mono text-secondary">114-04804</td>
<td class="p-sm">Intermediate Presser</td>
<td class="p-sm text-right">1</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-sm font-mono text-secondary">400-06488</td>
<td class="p-sm">Shuttle Hook Assembly</td>
<td class="p-sm text-right">1</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- Section 6: Maintenance and Error Codes -->
<section class="flex flex-col gap-md scroll-mt-24" id="maintenance">
<h2 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-base">Maintenance and Error Codes</h2>
<div class="flex flex-col gap-sm">
<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-outline" placeholder="Search error codes or definitions..." type="text"/>
</div>
<div class="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
<table class="w-full text-left border-collapse">
<thead class="bg-secondary text-on-primary font-label-caps text-label-caps">
<tr>
<th class="p-sm border-b border-outline-variant w-24">Code</th>
<th class="p-sm border-b border-outline-variant w-1/3">Definition</th>
<th class="p-sm border-b border-outline-variant">Corrective Action</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-on-surface">
<tr class="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="p-sm font-bold text-error">E007</td>
<td class="p-sm font-semibold">Machine Lock / Shaft Error</td>
<td class="p-sm text-on-surface-variant">Check for thread jams in shuttle or obstruction</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container hover:bg-surface-container-low transition-colors">
<td class="p-sm font-bold text-error">E031</td>
<td class="p-sm font-semibold">Low Air Pressure</td>
<td class="p-sm text-on-surface-variant">Check compressor and air hose for Type L frames</td>
</tr>
<tr class="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
<td class="p-sm font-bold text-error">E220</td>
<td class="p-sm font-semibold">Grease Run-out</td>
<td class="p-sm text-on-surface-variant">Replenish Grease A/B and reset Memory Switch 245</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<!-- Mobile Download Action -->
<div class="flex justify-center mt-lg mb-xl md:hidden">
<button class="w-full bg-primary text-on-primary font-headline-md text-headline-md font-bold px-lg py-sm rounded flex items-center justify-center gap-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
<span class="material-symbols-outlined">download</span>
                        DOWNLOAD TECHNICAL REPORT
                    </button>
</div>
</main>
</div>
<!-- Footer -->
<footer class="bg-secondary dark:bg-on-secondary-fixed text-on-secondary dark:text-secondary-fixed flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-xl border-t border-outline-variant mt-auto">
<div class="font-headline-md text-headline-md font-black text-on-primary mb-sm md:mb-0">
            TechFactory Database
        </div>
<div class="font-body-sm text-body-sm text-center md:text-left mb-sm md:mb-0">
            © 2024 Industrial Systems Database. All rights reserved. Technical documentation intended for professional use.
        </div>
<div class="flex gap-md font-body-sm text-body-sm">
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Privacy Policy</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Terms of Service</a>
<a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Archive</a>
</div>
</footer>
</body></html>

<!-- TechFactory CMS Dashboard -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>TechFactory Database - CMS</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&amp;family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&amp;family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config -->
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-bright": "#f9f9f9",
                    "on-error-container": "#93000a",
                    "surface-container-low": "#f3f3f3",
                    "on-primary": "#ffffff",
                    "secondary": "#535f70",
                    "outline": "#707881",
                    "on-secondary-container": "#576474",
                    "primary": "#006291",
                    "primary-fixed": "#cbe6ff",
                    "on-surface": "#1a1c1c",
                    "inverse-surface": "#2f3131",
                    "inverse-primary": "#8ecdff",
                    "tertiary-fixed-dim": "#ffb693",
                    "on-secondary": "#ffffff",
                    "tertiary": "#9d3f00",
                    "primary-container": "#007cb6",
                    "on-background": "#1a1c1c",
                    "on-tertiary-container": "#fffdff",
                    "on-primary-fixed": "#001e30",
                    "outline-variant": "#bfc7d1",
                    "surface-variant": "#e2e2e2",
                    "surface-container-lowest": "#ffffff",
                    "surface-container-highest": "#e2e2e2",
                    "surface-container-high": "#e8e8e8",
                    "error-container": "#ffdad6",
                    "on-secondary-fixed-variant": "#3c4858",
                    "secondary-fixed": "#d7e3f7",
                    "surface-tint": "#006494",
                    "on-tertiary": "#ffffff",
                    "on-primary-fixed-variant": "#004b71",
                    "on-surface-variant": "#3f4850",
                    "on-error": "#ffffff",
                    "background": "#f9f9f9",
                    "tertiary-fixed": "#ffdbcc",
                    "secondary-container": "#d4e1f5",
                    "primary-fixed-dim": "#8ecdff",
                    "inverse-on-surface": "#f0f1f1",
                    "surface-dim": "#dadada",
                    "on-tertiary-fixed": "#351000",
                    "on-primary-container": "#fefdff",
                    "on-tertiary-fixed-variant": "#7a3000",
                    "on-secondary-fixed": "#101c2b",
                    "secondary-fixed-dim": "#bbc7db",
                    "surface": "#f9f9f9",
                    "tertiary-container": "#c55100",
                    "surface-container": "#eeeeee",
                    "error": "#ba1a1a"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "sm": "16px",
                    "gutter": "24px",
                    "md": "24px",
                    "margin-mobile": "20px",
                    "margin-desktop": "64px",
                    "xs": "8px",
                    "lg": "48px",
                    "xl": "80px",
                    "base": "4px"
            },
            "fontFamily": {
                    "body-md": [
                            "Inter"
                    ],
                    "body-lg": [
                            "Inter"
                    ],
                    "label-caps": [
                            "JetBrains Mono"
                    ],
                    "body-sm": [
                            "Inter"
                    ],
                    "headline-md": [
                            "Hanken Grotesk"
                    ],
                    "headline-lg-mobile": [
                            "Hanken Grotesk"
                    ],
                    "display-xl": [
                            "Hanken Grotesk"
                    ],
                    "headline-lg": [
                            "Hanken Grotesk"
                    ]
            },
            "fontSize": {
                    "body-md": [
                            "16px",
                            {
                                    "lineHeight": "24px",
                                    "fontWeight": "400"
                            }
                    ],
                    "body-lg": [
                            "18px",
                            {
                                    "lineHeight": "28px",
                                    "fontWeight": "400"
                            }
                    ],
                    "label-caps": [
                            "12px",
                            {
                                    "lineHeight": "16px",
                                    "letterSpacing": "0.05em",
                                    "fontWeight": "600"
                            }
                    ],
                    "body-sm": [
                            "14px",
                            {
                                    "lineHeight": "20px",
                                    "fontWeight": "400"
                            }
                    ],
                    "headline-md": [
                            "24px",
                            {
                                    "lineHeight": "32px",
                                    "fontWeight": "700"
                            }
                    ],
                    "headline-lg-mobile": [
                            "28px",
                            {
                                    "lineHeight": "36px",
                                    "fontWeight": "700"
                            }
                    ],
                    "display-xl": [
                            "48px",
                            {
                                    "lineHeight": "56px",
                                    "letterSpacing": "-0.02em",
                                    "fontWeight": "800"
                            }
                    ],
                    "headline-lg": [
                            "32px",
                            {
                                    "lineHeight": "40px",
                                    "fontWeight": "700"
                            }
                    ]
            }
        },
        },
      }
    </script>
</head>
<body class="bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col antialiased">
<!-- TopNavBar Shared Component -->
<nav class="bg-secondary dark:bg-on-secondary-fixed-variant text-on-primary dark:text-primary-fixed-dim border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop py-4 transition-all duration-200 ease-in-out docked full-width top-0 z-50">
<div class="flex items-center gap-gutter">
<span class="text-headline-md font-headline-md font-bold text-on-primary tracking-tight">TechFactory Database</span>
<ul class="hidden md:flex gap-md font-label-caps text-label-caps items-center h-full pt-2">
<li class="cursor-pointer">
<span class="text-on-primary border-b-2 border-on-primary pb-1 font-bold">Databases</span>
</li>
<li class="cursor-pointer">
<span class="text-secondary-fixed hover:text-on-primary transition-colors hover:bg-secondary-fixed-variant/20 px-2 py-1 rounded-DEFAULT">Specifications</span>
</li>
<li class="cursor-pointer">
<span class="text-secondary-fixed hover:text-on-primary transition-colors hover:bg-secondary-fixed-variant/20 px-2 py-1 rounded-DEFAULT">Working Principles</span>
</li>
<li class="cursor-pointer">
<span class="text-secondary-fixed hover:text-on-primary transition-colors hover:bg-secondary-fixed-variant/20 px-2 py-1 rounded-DEFAULT">Maintenance</span>
</li>
<li class="cursor-pointer">
<span class="text-secondary-fixed hover:text-on-primary transition-colors hover:bg-secondary-fixed-variant/20 px-2 py-1 rounded-DEFAULT">Reports</span>
</li>
</ul>
</div>
<div class="flex gap-sm items-center">
<button class="hover:bg-secondary-fixed-variant/20 p-2 rounded-full transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-[24px]">settings</span>
</button>
<button class="hover:bg-secondary-fixed-variant/20 p-2 rounded-full transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-[24px]">account_circle</span>
</button>
</div>
</nav>
<!-- Main Application Area -->
<div class="flex flex-1 overflow-hidden">
<!-- Sidebar Navigation -->
<aside class="w-[280px] bg-surface-container-lowest border-r border-outline-variant flex-shrink-0 hidden md:flex flex-col">
<div class="p-lg border-b border-outline-variant">
<span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">CMS Management</span>
</div>
<nav class="flex-1 overflow-y-auto py-sm">
<ul class="flex flex-col gap-base px-sm">
<li>
<a class="flex items-center gap-sm px-sm py-xs rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
                            Dashboard
                        </a>
</li>
<li>
<a class="flex items-center gap-sm px-sm py-xs rounded-DEFAULT bg-surface-variant text-on-surface font-body-sm text-body-sm font-semibold" href="#">
<span class="material-symbols-outlined text-[20px] text-primary">database</span>
                            Machine Records
                        </a>
</li>
<li>
<a class="flex items-center gap-sm px-sm py-xs rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">perm_media</span>
                            Media Library
                        </a>
</li>
<li>
<a class="flex items-center gap-sm px-sm py-xs rounded-DEFAULT text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">build</span>
                            Global Settings
                        </a>
</li>
</ul>
</nav>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 overflow-y-auto bg-background">
<div class="px-margin-desktop py-lg max-w-[1440px] mx-auto">
<!-- Page Header -->
<header class="flex justify-between items-end mb-md">
<div>
<h1 class="font-display-xl text-display-xl text-on-surface mb-base">Machine Records</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">Manage technical specifications, maintenance logs, and operational parameters for all deployed industrial assets.</p>
</div>
<button class="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-md py-sm rounded-DEFAULT uppercase tracking-wider transition-colors flex items-center gap-xs shadow-sm">
<span class="material-symbols-outlined text-[18px]">add</span>
                        Add New Machine
                    </button>
</header>
<!-- Summary Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm flex items-center gap-md">
<div class="bg-primary-container/10 p-sm rounded-full text-primary">
<span class="material-symbols-outlined text-[32px]">precision_manufacturing</span>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Machines</p>
<p class="font-headline-lg text-headline-lg text-on-surface font-bold">124</p>
</div>
</div>
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm flex items-center gap-md">
<div class="bg-tertiary-container/10 p-sm rounded-full text-tertiary">
<span class="material-symbols-outlined text-[32px]">update</span>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Recent Updates</p>
<p class="font-headline-lg text-headline-lg text-on-surface font-bold">18</p>
</div>
</div>
<div class="bg-surface-container-lowest border border-outline-variant p-md rounded-lg shadow-sm flex items-center gap-md">
<div class="bg-error-container/20 p-sm rounded-full text-error">
<span class="material-symbols-outlined text-[32px]">error</span>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Error Logs</p>
<p class="font-headline-lg text-headline-lg text-on-surface font-bold">3</p>
</div>
</div>
</div>
<!-- Data Table Section -->
<section class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden shadow-sm">
<!-- Table Toolbar -->
<div class="flex justify-between items-center p-sm border-b border-outline-variant bg-surface-bright">
<div class="relative w-80">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full pl-[40px] pr-sm py-xs bg-surface-container-lowest border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors shadow-sm" placeholder="Search records by ID, model, or category..." type="text"/>
</div>
<div class="flex gap-sm">
<button class="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-DEFAULT text-on-surface font-label-caps text-label-caps hover:bg-surface-container-low transition-colors shadow-sm bg-surface-container-lowest">
<span class="material-symbols-outlined text-[16px]">filter_list</span>
                                Filter
                            </button>
<button class="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-DEFAULT text-on-surface font-label-caps text-label-caps hover:bg-surface-container-low transition-colors shadow-sm bg-surface-container-lowest">
<span class="material-symbols-outlined text-[16px]">view_column</span>
                                Columns
                            </button>
<button class="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-DEFAULT text-on-surface font-label-caps text-label-caps hover:bg-surface-container-low transition-colors shadow-sm bg-surface-container-lowest">
<span class="material-symbols-outlined text-[16px]">download</span>
                                Export
                            </button>
</div>
</div>
<!-- The Table -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase border-b border-outline-variant">
<tr>
<th class="p-xs pl-sm font-semibold whitespace-nowrap w-[48px] text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</th>
<th class="p-xs font-semibold whitespace-nowrap">Status</th>
<th class="p-xs font-semibold whitespace-nowrap">Model / Designation</th>
<th class="p-xs font-semibold whitespace-nowrap">Category</th>
<th class="p-xs font-semibold whitespace-nowrap">Last Modified</th>
<th class="p-xs pr-sm font-semibold whitespace-nowrap text-right">Actions</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm text-on-surface">
<!-- Row 1 -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="p-xs pl-sm border-b border-outline-variant/50 text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="p-xs border-b border-outline-variant/50">
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] uppercase tracking-wider">
                                            Published
                                        </span>
</td>
<td class="p-xs border-b border-outline-variant/50 font-medium text-primary hover:underline cursor-pointer">JUKI AMS-210EN</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">Computer-controlled Cycle Machine</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">2024-05-12 08:30Z</td>
<td class="p-xs pr-sm border-b border-outline-variant/50 text-right">
<div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-outline hover:text-primary transition-colors p-1" title="View Details"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
<button class="text-outline hover:text-primary transition-colors p-1" title="Edit Record"><span class="material-symbols-outlined text-[18px]">edit</span></button>
<button class="text-outline hover:text-error transition-colors p-1" title="Archive"><span class="material-symbols-outlined text-[18px]">archive</span></button>
</div>
</td>
</tr>
<!-- Row 2 -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="p-xs pl-sm border-b border-outline-variant/50 text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="p-xs border-b border-outline-variant/50">
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-[10px] uppercase tracking-wider border border-outline-variant/30">
                                            Draft
                                        </span>
</td>
<td class="p-xs border-b border-outline-variant/50 font-medium text-primary hover:underline cursor-pointer">Mazak Integrex i-200S</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">Multi-Tasking CNC</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">2024-05-10 14:15Z</td>
<td class="p-xs pr-sm border-b border-outline-variant/50 text-right">
<div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-outline hover:text-primary transition-colors p-1" title="View Details"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
<button class="text-outline hover:text-primary transition-colors p-1" title="Edit Record"><span class="material-symbols-outlined text-[18px]">edit</span></button>
<button class="text-outline hover:text-error transition-colors p-1" title="Archive"><span class="material-symbols-outlined text-[18px]">archive</span></button>
</div>
</td>
</tr>
<!-- Row 3 -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="p-xs pl-sm border-b border-outline-variant/50 text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="p-xs border-b border-outline-variant/50">
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] uppercase tracking-wider">
                                            Published
                                        </span>
</td>
<td class="p-xs border-b border-outline-variant/50 font-medium text-primary hover:underline cursor-pointer">Fanuc R-2000iC/165F</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">Industrial Robot Arm</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">2024-05-08 09:45Z</td>
<td class="p-xs pr-sm border-b border-outline-variant/50 text-right">
<div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-outline hover:text-primary transition-colors p-1" title="View Details"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
<button class="text-outline hover:text-primary transition-colors p-1" title="Edit Record"><span class="material-symbols-outlined text-[18px]">edit</span></button>
<button class="text-outline hover:text-error transition-colors p-1" title="Archive"><span class="material-symbols-outlined text-[18px]">archive</span></button>
</div>
</td>
</tr>
<!-- Row 4 -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="p-xs pl-sm border-b border-outline-variant/50 text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="p-xs border-b border-outline-variant/50">
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-caps text-[10px] uppercase tracking-wider">
                                            Archived
                                        </span>
</td>
<td class="p-xs border-b border-outline-variant/50 font-medium text-primary hover:underline cursor-pointer">HAAS VF-4</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">Vertical Machining Center</td>
<td class="p-xs border-b border-outline-variant/50 text-on-surface-variant">2024-05-01 11:20Z</td>
<td class="p-xs pr-sm border-b border-outline-variant/50 text-right">
<div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-outline hover:text-primary transition-colors p-1" title="View Details"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
<button class="text-outline hover:text-primary transition-colors p-1" title="Restore Record"><span class="material-symbols-outlined text-[18px]">restore</span></button>
<button class="text-outline hover:text-error transition-colors p-1" title="Delete"><span class="material-symbols-outlined text-[18px]">delete_forever</span></button>
</div>
</td>
</tr>
<!-- Row 5 -->
<tr class="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<td class="p-xs pl-sm text-center">
<input class="rounded-sm border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="p-xs">
<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-[10px] uppercase tracking-wider border border-outline-variant/30">
                                            Draft
                                        </span>
</td>
<td class="p-xs font-medium text-primary hover:underline cursor-pointer">Trumpf TruLaser 5030</td>
<td class="p-xs text-on-surface-variant">Fiber Laser Cutting Machine</td>
<td class="p-xs text-on-surface-variant">2024-04-28 16:05Z</td>
<td class="p-xs pr-sm text-right">
<div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="text-outline hover:text-primary transition-colors p-1" title="View Details"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
<button class="text-outline hover:text-primary transition-colors p-1" title="Edit Record"><span class="material-symbols-outlined text-[18px]">edit</span></button>
<button class="text-outline hover:text-error transition-colors p-1" title="Archive"><span class="material-symbols-outlined text-[18px]">archive</span></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Pagination -->
<div class="flex justify-between items-center p-sm border-t border-outline-variant bg-surface-bright font-body-sm text-body-sm text-on-surface-variant">
<span>Showing 1 to 5 of 124 records</span>
<div class="flex gap-xs">
<button class="px-sm py-xs border border-outline-variant rounded-DEFAULT hover:bg-surface-container-low disabled:opacity-50" disabled="">Previous</button>
<button class="px-sm py-xs border border-outline-variant rounded-DEFAULT bg-primary text-on-primary font-bold">1</button>
<button class="px-sm py-xs border border-outline-variant rounded-DEFAULT hover:bg-surface-container-low bg-surface-container-lowest">2</button>
<button class="px-sm py-xs border border-outline-variant rounded-DEFAULT hover:bg-surface-container-low bg-surface-container-lowest">3</button>
<span class="px-2 py-xs">...</span>
<button class="px-sm py-xs border border-outline-variant rounded-DEFAULT hover:bg-surface-container-low bg-surface-container-lowest">Next</button>
</div>
</div>
</section>
</div>
</main>
</div>
<!-- Footer Shared Component -->
<footer class="bg-secondary dark:bg-on-secondary-fixed text-on-secondary dark:text-secondary-fixed font-body-sm text-body-sm border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-xl mt-auto z-50">
<div class="mb-md md:mb-0">
<span class="font-headline-md text-headline-md font-black text-on-primary block mb-xs">TechFactory Database</span>
<p class="text-secondary-fixed opacity-80">© 2024 Industrial Systems Database. All rights reserved. Technical documentation intended for professional use.</p>
</div>
<ul class="flex flex-wrap gap-md items-center">
<li><a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Privacy Policy</a></li>
<li><a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Terms of Service</a></li>
<li><a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Archive</a></li>
<li><a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Contact Engineering</a></li>
<li><a class="text-secondary-fixed hover:text-on-primary hover:underline transition-colors" href="#">Global Standards</a></li>
</ul>
</footer>
</body></html>