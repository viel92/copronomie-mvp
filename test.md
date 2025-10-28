{
  "projectInfo": {
    "name": "Fluence AI",
    "description": "Site web moderne pour une solution d'intelligence artificielle - Full Stack Landing Page",
    "liveUrl": "https://philosophical-state-421641.framer.app/",
    "stagingUrl": "https://philosophical-state-421641.framer.app/",
    "lastDeployment": "2025-12-08",
    "totalPages": 6,
    "totalComponents": 35,
    "designSystem": "Minimalist, Modern AI-focused design"
  },

  "reactExport": {
    "method": "Framer React Export Plugin",
    "cliCommand": "npx -y unframer example-app <projectId>",
    "documentation": "https://github.com/remorses/unframer",
    "outputFormat": {
      "files": ".jsx components + .css styles",
      "structure": "Machine-generated React components",
      "customization": "Framer variables → React props"
    },
    "componentUrls": {
      "Tag": "https://framer.com/m/Tag-yria.js",
      "note": "Chaque composant a une URL d'import unique"
    },
    "installation": {
      "step1": "npm install -g unframer",
      "step2": "unframer login (use same Google account as Framer)",
      "step3": "npx -y unframer example-app <projectId>",
      "step4": "cd example-app && npm install",
      "step5": "npm run dev"
    }
  },

  "colorSystem": {
    "palette": {
      "neutrals": {
        "/Black": {
          "value": "rgb(27, 12, 37)",
          "usage": "Primary text, dark backgrounds, footer",
          "contrast": "High contrast with white"
        },
        "/White": {
          "value": "rgb(255, 255, 255)",
          "usage": "Cards, backgrounds, text on dark",
          "opacity_variants": ["1", "0.6", "0.5", "0.26", "0.2", "0.1"]
        },
        "/Gray Dark": {
          "value": "rgb(237, 235, 238)",
          "usage": "Borders, separators, disabled states"
        },
        "/Gray": {
          "value": "rgb(247, 246, 247)",
          "usage": "Page background, card backgrounds"
        }
      },
      "accents_light": {
        "/Blue Lite": "rgb(223, 233, 253)",
        "/Purple Lite": "rgb(234, 226, 242)",
        "/Orange Lite": "rgb(247, 230, 221)",
        "/Pink Lite": "rgb(245, 228, 239)"
      },
      "accents": {
        "/Blue": "rgb(128, 170, 253)",
        "/Purple": "rgb(211, 123, 255)",
        "/Orange": "rgb(252, 172, 132)",
        "/Pink": "rgb(255, 130, 225)"
      },
      "gradients": {
        "primary": {
          "type": "linear-gradient",
          "stops": [
            {"offset": "0%", "color": "#F0E9F7"},
            {"offset": "60.8%", "color": "#D588FC"},
            {"offset": "100%", "color": "#FF49D4"}
          ],
          "usage": "Logo, icons, decorative elements"
        },
        "secondary": {
          "type": "linear-gradient",
          "stops": [
            {"offset": "0.21", "color": "white"},
            {"offset": "0.68", "color": "#D588FC"},
            {"offset": "1", "color": "#FF49D4"}
          ],
          "usage": "Logo alternative"
        },
        "multi": {
          "stops": [
            {"color": "#7AA7FF", "position": "start"},
            {"color": "#CC65FF", "position": "31.087%"},
            {"color": "#FF9C6A", "position": "70.46%"},
            {"color": "#FF49D4", "position": "end"}
          ],
          "usage": "Icons, decorative elements"
        }
      }
    }
  },

  "typography": {
    "fontFamily": {
      "primary": "General Sans",
      "source": "Fontsource (FS;General Sans-*)",
      "weights": ["regular", "medium"],
      "fallback": "system-ui, -apple-system, sans-serif"
    },
    "textStyles": {
      "/Heading 1": {
        "font": "FS;General Sans-medium",
        "fontSize": "76px",
        "lineHeight": "1em",
        "letterSpacing": "0px",
        "tag": "h1",
        "responsive": {
          "tablet": "60px",
          "mobile": "44px"
        },
        "usage": "Hero titles, main headlines"
      },
      "/Heading 2": {
        "fontSize": "60px",
        "lineHeight": "1em",
        "paragraphSpacing": "40px",
        "tag": "h2",
        "responsive": {
          "tablet": "48px",
          "mobile": "36px"
        },
        "usage": "Section titles"
      },
      "/Heading 3": {
        "fontSize": "44px",
        "lineHeight": "1.2em",
        "tag": "h3",
        "responsive": {
          "tablet": "36px",
          "mobile": "28px"
        },
        "usage": "Subsection titles, feature cards"
      },
      "/Heading 4": {
        "fontSize": "32px",
        "lineHeight": "1.2em",
        "tag": "h4",
        "responsive": {
          "tablet": "28px",
          "mobile": "24px"
        },
        "usage": "Card titles, content blocks"
      },
      "/Sub Title": {
        "fontSize": "24px",
        "lineHeight": "1.2em",
        "tag": "h4",
        "usage": "Subtitles, pricing plans, blog cards"
      },
      "/Body 18": {
        "font": "FS;General Sans-regular",
        "fontSize": "18px",
        "lineHeight": "28px",
        "tag": "p",
        "usage": "Large body text, descriptions"
      },
      "/Body 18 m": {
        "font": "FS;General Sans-medium",
        "fontSize": "18px",
        "lineHeight": "28px",
        "usage": "Emphasized body text"
      },
      "/Body 16": {
        "fontSize": "16px",
        "lineHeight": "26px",
        "paragraphSpacing": "20px",
        "usage": "Standard body text, most content"
      },
      "/Body 16 m": {
        "fontSize": "16px",
        "lineHeight": "26px",
        "weight": "medium",
        "usage": "Button text, emphasized content"
      },
      "/Body 14": {
        "fontSize": "14px",
        "lineHeight": "22px",
        "usage": "Small text, captions, metadata"
      },
      "/Tag": {
        "fontSize": "14px",
        "lineHeight": "16px",
        "letterSpacing": "0px",
        "transform": "uppercase",
        "weight": "medium",
        "usage": "Tags, badges, labels"
      }
    }
  },

  "layoutSystem": {
    "breakpoints": {
      "desktop": {
        "min": "1200px",
        "maxContentWidth": "1240px",
        "padding": "140px-160px vertical, 16px-40px horizontal"
      },
      "tablet": {
        "width": "810px",
        "padding": "80px-120px vertical, 30px horizontal"
      },
      "mobile": {
        "width": "390px",
        "padding": "64px vertical, 16px horizontal"
      }
    },
    "spacing": {
      "sections": {
        "large": "160px",
        "medium": "100px-140px",
        "small": "60px-80px"
      },
      "cards": {
        "outer": "24px-40px",
        "inner": "16px-32px"
      },
      "elements": {
        "large": "24px-32px",
        "medium": "16px",
        "small": "8px-12px"
      }
    },
    "borderRadius": {
      "pills": "99px-999px (tags, toggle buttons)",
      "cards": "16px (feature cards, pricing)",
      "medium": "12px-14px (images, containers)",
      "small": "8px (buttons, inputs)"
    },
    "stackLayouts": {
      "vertical": {
        "distribution": ["start", "center", "end", "space-between"],
        "alignment": ["start", "center", "end"],
        "gaps": ["8px", "12px", "16px", "24px", "32px", "40px", "60px", "100px", "160px"]
      },
      "horizontal": {
        "distribution": ["start", "center", "end", "space-between", "space-around", "space-evenly"],
        "alignment": ["start", "center", "end"],
        "wrap": true
      }
    },
    "gridLayouts": {
      "columns": {
        "auto-fill": "Automatic based on gridColumnWidth",
        "fixed": "1, 2, 3 columns"
      },
      "gaps": ["10px", "16px", "20px", "24px"],
      "itemSpanning": {
        "columnSpan": "1, 2, 3, or 'all'",
        "rowSpan": "1, 2, 3+"
      }
    }
  },

  "pages": {
    "home": {
      "path": "/",
      "nodeId": "augiA20Il",
      "description": "Main landing page - full sections breakdown",
      "sections": [
        {
          "id": "hero",
          "anchor": null,
          "type": "Hero Section",
          "background": "Gradient with decorative elements",
          "layout": "Centered vertical stack",
          "elements": [
            {
              "type": "Navigation",
              "component": "Navigation",
              "variant": "Desktop/Phone",
              "position": "Sticky top",
              "backgroundColor": "rgba(255, 255, 255, 0.1)"
            },
            {
              "type": "Tag",
              "text": "Transform Your Business with AI",
              "variant": "Primary"
            },
            {
              "type": "Heading",
              "text": "Empower Your Business\nWith AI-Driven\nIntelligence",
              "style": "/Heading 1",
              "maxWidth": "900px"
            },
            {
              "type": "Description",
              "text": "Fluence AI helps you integrate...",
              "style": "/Body 18",
              "maxWidth": "700px"
            },
            {
              "type": "CTA Buttons",
              "layout": "Horizontal stack, gap 16px",
              "buttons": [
                {"text": "Get Started", "variant": "Primary", "link": "/contact"},
                {"text": "Book a Demo", "variant": "Secondary"}
              ]
            },
            {
              "type": "Hero Chat UI",
              "component": "PYdd9YjCc + D3A2I9bWQ",
              "description": "Interactive chat interface mockup"
            }
          ]
        },
        {
          "id": "ticker",
          "type": "Ticker Section",
          "component": "TickerDesktop / TickerMobile",
          "nodeId": "XRWPqwehD",
          "content": {
            "text": "Request a demo",
            "icon": "AI logo (300x300)",
            "animation": "Continuous horizontal scroll",
            "speed": "70px/s",
            "direction": "left",
            "gap": "0px"
          },
          "decoration": {
            "icons": ["Gradient AI logo", "decorative elements"],
            "links": "https://www.framer.com?via=amani_design"
          }
        },
        {
          "id": "stats",
          "anchor": "#about",
          "type": "Statistics Section",
          "background": "/White",
          "layout": "3 columns grid",
          "components": [
            {
              "component": "NumberCard",
              "nodeId": "OOkc5DYL8",
              "props": {
                "number": "Counter animation (88 speed)",
                "suffix": "+",
                "text": "Apps & services, and growing.",
                "alignment": "center/start"
              }
            }
          ],
          "note": "3 identical NumberCard components with different numbers"
        },
        {
          "id": "features",
          "anchor": "#feature",
          "type": "Features Section",
          "header": {
            "tag": "Features",
            "title": "Powerful Features to\nDrive Your Growth",
            "description": "Explore the comprehensive suite of features..."
          },
          "layout": "Vertical stack of feature cards",
          "cards": [
            {
              "component": "Feature Card",
              "nodeId": "sRL5Z3eVx",
              "variant": "DesktopLeft",
              "structure": {
                "image": "Left side, 528px, aspect 1.069",
                "content": {
                  "title": "Seamless Data Integration Process",
                  "description": "Effortlessly connect with diverse data sources...",
                  "features": [
                    "FeatureItem: Real-Time Data Syncing",
                    "FeatureItem: Multi-Platform Support",
                    "FeatureItem: Secure Data Transfer"
                  ]
                }
              }
            },
            {
              "variant": "DesktopRight",
              "note": "Image on right side, text on left"
            },
            {
              "variant": "DesktopLeft",
              "note": "Alternating layout"
            }
          ]
        },
        {
          "id": "how-it-works",
          "type": "Process Section",
          "header": {
            "tag": "How it works",
            "title": "Get Started in Three\nSimple Steps",
            "description": "Our streamlined process makes it easy..."
          },
          "steps": [
            {
              "component": "Step",
              "nodeId": "SabNg7qKY",
              "structure": {
                "image": "254px height, aspect 1.37, radius 12px",
                "title": "Connect Your Data Sources",
                "description": "Link your existing tools and platforms...",
                "padding": "8px, content 22px"
              }
            }
          ],
          "layout": "Grid, 3 columns, gap 24px"
        },
        {
          "id": "testimonials",
          "anchor": "#testimonial",
          "type": "Testimonials Section",
          "component": "TestimonialSlider",
          "nodeId": "GIPSGi5NZ",
          "header": {
            "tag": "Customer love",
            "title": "What Our Customers Say",
            "description": "Hear from businesses that transformed..."
          },
          "slider": {
            "width": "650px",
            "height": "330px",
            "direction": "left",
            "autoPlay": false,
            "interval": "1.5s",
            "drag": false,
            "itemAmount": 1,
            "gap": "10px",
            "cards": [
              {
                "quote": "Fluence AI has revolutionized the way we process data...",
                "author": "Sarah J.",
                "role": "Data Analyst, TechCorp"
              },
              {
                "quote": "The automation features in Fluence AI have made our workflows...",
                "author": "Mark L.",
                "role": "Operations Manager, GrowthTech"
              },
              {
                "quote": "Thanks to Fluence AI, we now make data-driven decisions...",
                "author": "Emily R.",
                "role": "Marketing Director, InnovateCo"
              }
            ]
          },
          "background": {
            "blur": "rgba(255, 255, 255, 0.5)",
            "opacity": "0.5",
            "radius": "14px"
          }
        },
        {
          "id": "pricing",
          "anchor": "#pricing",
          "type": "Pricing Section",
          "component": "Pricing / PricingMain",
          "nodeId": "RVU2jNR6F / ivMW7eXD4",
          "header": {
            "tag": "Pricing",
            "title": "Simple, Flexible Pricing",
            "description": "Pricing plans for businesses at every stage of growth."
          },
          "toggle": {
            "component": "Toggle",
            "nodeId": "iERezogGn",
            "variants": ["Monthly (yqTWLOfWe)", "Yearly (RvfakH4Nz)"],
            "default": "Monthly"
          },
          "plans": [
            {
              "name": "Starter (Free)",
              "component": "PricingPlan (fTD88Tbv8)",
              "variant": "Plan1 (nxqQ7mlkO)",
              "icon": "Star gradient",
              "subtitle": "Get started with Fluence AI at no cost",
              "price": {
                "monthly": "Free",
                "yearly": "Free",
                "component": "PricingPlanPrice (U9QtchrTZ)"
              },
              "cta": {
                "text": "Get Started",
                "variant": "Secondary-2",
                "link": "/contact"
              },
              "features": [
                "400 AI credits at signup",
                "20,000 AI token inputs",
                "Calendar integration & syncing",
                "Guest sharing and links"
              ],
              "highlighted": false
            },
            {
              "name": "Plus",
              "variant": "Plan2 (RnqVvaD3j)",
              "price": "$22",
              "highlighted": true,
              "badge": "Most Popular",
              "backgroundColor": "/Black",
              "textColor": "/White",
              "features": [
                "Everything in Starter",
                "50,000 AI token inputs",
                "Priority support",
                "Advanced analytics"
              ]
            },
            {
              "name": "Pro",
              "variant": "Plan3 (URNhs4gTQ)",
              "price": "$69",
              "subtitle": "Take your business to the next level",
              "features": [
                "Everything in Plus",
                "Unlimited AI tokens",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantee"
              ]
            }
          ],
          "layout": "Horizontal stack, 3 cards, gap 24px",
          "responsive": {
            "tablet": "Vertical stack",
            "mobile": "Vertical stack, full width"
          }
        },
        {
          "id": "faq",
          "anchor": "#faq",
          "type": "FAQ Section",
          "component": "Main (Accordion wrapper)",
          "nodeId": "ookRBWkBa",
          "header": {
            "tag": "FAQ",
            "title": "Frequently Asked Questions",
            "description": "Find answers to common questions..."
          },
          "questions": [
            {
              "component": "AccordionFaq",
              "nodeId": "LPj45F3ii",
              "variants": ["Closed (uBkNmHzNV)", "Open (sG3NVwXcH)"],
              "structure": {
                "backgroundColor": "/Gray or /Gray Dark",
                "borderRadius": "8px",
                "padding": "20px",
                "icon": "AccordionIcon (hDaqqPDsW)",
                "iconVariants": ["Open (xX1RAZS8z)", "Close (D24kQElLr)"]
              },
              "items": [
                {
                  "question": "What is Fluence AI?",
                  "answer": "Fluence AI is a powerful platform designed to help businesses integrate, analyze, and automate data workflows using artificial intelligence. It empowers teams to make smarter decisions and drive growth through seamless data management.",
                  "default": "closed"
                },
                {
                  "question": "Can I integrate Fluence AI with my existing tools?",
                  "answer": "Yes! Fluence AI supports integration with a wide range of tools and platforms. Our flexible APIs allow you to connect with your data sources effortlessly, enabling a smooth workflow.",
                  "default": "open"
                },
                {
                  "question": "How does Fluence AI automate tasks?",
                  "answer": "Fluence AI uses AI-driven workflows to automate repetitive tasks such as data processing, reporting, and notifications. This helps save time and boosts productivity for your team."
                },
                {
                  "question": "Is my data secure with Fluence AI?",
                  "answer": "Absolutely! Fluence AI takes security seriously. We use enterprise-grade encryption to protect your data, ensuring that it's secure at all stages, from integration to processing."
                },
                {
                  "question": "What kind of support do you offer?",
                  "answer": "We offer 24/7 support via email for all users, with additional live chat and priority support for Plus and Pro plan subscribers. Our team is always ready to assist with any questions or issues you may have."
                }
              ]
            }
          ],
          "layout": "Vertical stack, gap 12px, max-width 1000px"
        },
        {
          "id": "footer",
          "type": "Footer",
          "component": "Footer (FBO9CnB_6)",
          "description": "See full footer structure in components section"
        }
      ],
      "animations": {
        "hero": "Fade in on load",
        "sections": "Fade in on scroll",
        "buttons": "Hover: vertical slide with dual text",
        "cards": "Hover: subtle scale or shadow",
        "accordion": "Expand/collapse with rotation icon"
      }
    },
    "contact": {
      "path": "/contact",
      "nodeId": "G9kMkT9Mv",
      "description": "Contact page with form (timeout - large page)",
      "expectedSections": [
        "Header with tag and title",
        "Contact form with fields",
        "Contact information",
        "Map or illustration"
      ]
    },
    "404": {
      "path": "/404",
      "nodeId": "yPBWQ56a0",
      "fullStructure": {
        "background": "/Gray",
        "hero": {
          "width": "full viewport",
          "height": "100vh",
          "maxWidth": "1920px",
          "borderRadius": "16px",
          "backgroundImage": "https://framerusercontent.com/images/ChLYQp9qidYmBasL0Sih4gYbmM.png",
          "padding": "40px",
          "layout": "Centered"
        },
        "content": {
          "container": {
            "maxWidth": "390px",
            "gap": "40px",
            "centered": true
          },
          "title": {
            "text": "404",
            "font": "FS;General Sans-medium",
            "size": "Very large"
          },
          "description": {
            "text": "Hmmmm... I couldn't find that page. It's just me playing the guitar :)",
            "style": "/Body 16"
          },
          "button": {
            "component": "ButtonButton",
            "variant": "Secondary (RYQOdgXwu)",
            "text": "Back to home",
            "link": "/",
            "width": "200px",
            "height": "50px"
          }
        }
      }
    },
    "privacy-policy": {
      "path": "/privacy-policy",
      "nodeId": "nm0D4XlxB",
      "fullStructure": {
        "background": "/Gray",
        "maxWidth": "1140px",
        "padding": "140px 16px",
        "sections": [
          {
            "header": {
              "tag": {"text": "Privacy Policy", "variant": "Secondary"},
              "title": "Privacy Policy",
              "subtitle": "Last Updated: November 15, 2024",
              "style": "/Heading 2"
            }
          },
          {
            "title": "Information We Collect",
            "style": "/Heading 4",
            "content": "We collect data to ensure seamless interactions and personalized experiences. When you use our services, we may collect personal details such as your name, email, and phone number. Additionally, we track your interactions with our website, including the pages you visit, the device you use, and the time spent on specific sections. Cookies are also used to store preferences and enhance functionality. All data collected is handled responsibly to maintain transparency and build trust."
          },
          {
            "title": "How We Use Your Data",
            "content": "The information you share with us is used to improve and personalize your experience. It helps us communicate effectively, optimize our services, and understand user preferences. Whether we're tailoring recommendations, sending updates, or improving website functionality, your data remains secure and confidential."
          },
          {
            "title": "Your Rights",
            "content": "We believe in empowering users to manage their personal data. You have the right to request access, update inaccuracies, or delete your information when necessary. If you no longer wish to receive updates or want to manage your cookie preferences, you can do so easily. Our commitment is to give you full control over your data while ensuring you remain informed about how it's used."
          },
          {
            "title": "Data Protection",
            "content": "We employ state-of-the-art measures to protect the information entrusted to us. From encryption to secure servers, your data is stored and managed with industry-leading security protocols. We also conduct regular system checks to prevent unauthorized access. While no system is completely immune to threats, our continuous efforts minimize risks and provide you with a safe online environment."
          },
          {
            "title": "Contact Us",
            "content": "If you have questions, need assistance, or want to know more about our data practices, we encourage you to contact us. Transparency is integral to our approach, and we are here to provide clarity whenever needed. Whether it's a simple query or a detailed concern, our team is ready to address your inquiries promptly and professionally."
          }
        ]
      }
    },
    "blog": {
      "path": "/blog",
      "nodeId": "g6WCdQaSj",
      "structure": {
        "background": "/Gray",
        "padding": "160px 20px",
        "header": {
          "tag": "Blog",
          "title": "Explore Our Blog And Stay Updated",
          "maxWidth": "700px"
        },
        "grid": {
          "component": "BlogCard (p37PzgvSj)",
          "layout": "Horizontal stack",
          "gap": "24px",
          "responsive": "Grid on tablet/mobile"
        }
      }
    },
    "blog-post": {
      "path": "/blog/:slug",
      "nodeId": "VB04Dwgbu",
      "dynamic": true,
      "cmsIntegration": true,
      "structure": {
        "background": "/Gray",
        "maxWidth": "1140px",
        "padding": "140px 16px",
        "header": {
          "tag": "CMS field",
          "title": "CMS title",
          "subtitle": "CMS date or author",
          "featuredImage": {
            "width": "100%",
            "maxWidth": "700px",
            "height": "200px",
            "aspectRatio": "1.5",
            "borderRadius": "16px"
          }
        },
        "content": {
          "richText": true,
          "style": "/Body 16",
          "maxWidth": "700px"
        }
      }
    }
  },

  "components": {
    "Tag": {
      "nodeId": "Ihf4JO3wW",
      "description": "Badge/tag avec icône étoile optionnelle",
      "importUrl": "https://framer.com/m/Tag-yria.js",
      "variants": {
        "Primary (rKYGRxnTs)": {
          "backgroundColor": "rgba(255, 255, 255, 0.2)",
          "borderRadius": "99px",
          "padding": "6px 12px",
          "gap": "8px",
          "icon": {
            "width": "16px",
            "height": "16px",
            "svg": "Star with gradient fill",
            "gradient": "linear-gradient from #F0E9F7 to #D588FC to #FF49D4"
          },
          "text": {
            "style": "/Tag",
            "color": "White",
            "transform": "uppercase"
          },
          "usage": "Primary tags on dark backgrounds"
        },
        "Secondary (M9HI8jaOk)": {
          "backgroundColor": "rgba(255, 255, 255, 1)",
          "borderRadius": "999px",
          "padding": "6px 14px",
          "icon": "None",
          "text": {
            "style": "/Tag",
            "color": "Black"
          },
          "usage": "Tags on light backgrounds"
        },
        "Blogs Tag (NW3Loi1kv)": {
          "similar": "Secondary",
          "usage": "Specifically for blog cards"
        }
      },
      "props": {
        "Buyp28_of": "string - Tag text content"
      }
    },
    "Button/Button": {
      "nodeId": "YBPGh7qim",
      "description": "Interactive button with hover animation",
      "variants": {
        "Primary (u3RW6678t)": {
          "width": "200px",
          "height": "50px",
          "backgroundColor": "/Black",
          "borderRadius": "8px",
          "padding": "12px",
          "layout": "horizontal center",
          "gap": "8px",
          "textContainer": {
            "width": "1fr",
            "height": "24px",
            "overflow": "hidden",
            "texts": [
              {
                "id": "Text1",
                "style": "/Body 16 m",
                "color": "/White",
                "position": "centerY 54%",
                "default": "Let's Talk"
              },
              {
                "id": "Text2",
                "style": "/Body 16 m",
                "color": "/White",
                "opacity": "0",
                "position": "centerY 171%",
                "default": "Let's Talk (duplicate for animation)"
              }
            ]
          },
          "animation": {
            "trigger": "hover",
            "effect": "Vertical slide (Text1 up, Text2 in)",
            "duration": "Fast"
          }
        },
        "Secondary (RYQOdgXwu)": {
          "backgroundColor": "rgba(255, 255, 255, 0.26)",
          "textColor": "/White",
          "usage": "Buttons on dark/transparent backgrounds"
        },
        "Secondary-2 (gYGlZFzwy)": {
          "backgroundColor": "rgb(255, 255, 255)",
          "textColor": "/Black",
          "usage": "Buttons on light backgrounds"
        },
        "Small (l0Cbq9BYT)": {
          "width": "120px",
          "height": "36px",
          "padding": "8px",
          "fontSize": "Smaller",
          "usage": "Compact buttons (navigation CTA)"
        }
      },
      "props": {
        "hD_Tjd3Q1": "string - Button text",
        "VV_uh9AAy": "string - Link URL or path",
        "Dlc_3jNMB": "boolean - Open in new tab"
      }
    },
    "Navigation": {
      "nodeId": "zl5QFyMzH",
      "description": "Responsive navigation bar",
      "variants": {
        "Desktop (liJgeBzhS)": {
          "width": "1240px",
          "maxWidth": "1240px",
          "backgroundColor": "rgba(255, 255, 255, 0.1)",
          "borderRadius": "16px",
          "padding": "12px",
          "layout": "horizontal space-between",
          "sections": {
            "logo": {
              "link": "/",
              "layout": "horizontal center",
              "gap": "14.4px",
              "icon": {
                "width": "40px",
                "height": "40px",
                "svg": "Fluence AI logo with gradient",
                "filters": "inner shadow, drop shadow"
              },
              "text": {
                "content": "Fluence AI",
                "font": "FS;General Sans-medium",
                "size": "18px"
              }
            },
            "links": {
              "component": "NavigationLink (EGswsQe2u)",
              "layout": "horizontal",
              "gap": "20px",
              "items": [
                {"text": "Fonctionnalités", "href": "/#feature"},
                {"text": "Tarifs", "href": "/#about"},
                {"text": "Témoignages", "href": "/#testimonial"},
                {"text": "Tarifs", "href": "/#pricing"},
                {"text": "FAQ", "href": "/#faq"}
              ]
            },
            "cta": {
              "component": "ButtonButton",
              "variant": "Small",
              "text": "Contact",
              "link": "/contact"
            }
          }
        },
        "Phone (EokQ3eRg8)": {
          "width": "390px",
          "height": "64px",
          "backgroundColor": "rgba(255, 255, 255, 0.6)",
          "borderRadius": "12px",
          "layout": "vertical center",
          "hamburgerMenu": true
        },
        "PhoneOpen (LOZ4kPLH4)": {
          "width": "390px",
          "height": "fit-content",
          "maxHeight": "100vh",
          "backgroundColor": "/White",
          "expanded": true,
          "menuItems": "Vertical stack"
        },
        "Small (NDwhqXM4L)": {
          "width": "700px",
          "backgroundColor": "rgba(255, 255, 255, 0.9)",
          "borderRadius": "14px",
          "padding": "8px",
          "compact": true
        },
        "DesktopWhite (vbBmKeoHe)": {
          "backgroundColor": "/White",
          "usage": "Navigation on light sections"
        },
        "PhoneWhite (qldhU1XUY)": {
          "backgroundColor": "/White",
          "usage": "Mobile nav on light sections"
        }
      }
    },
    "Footer": {
      "nodeId": "FBO9CnB_6",
      "description": "Comprehensive footer with CTA",
      "variants": {
        "DesktopL (mVRYywzXp)": {
          "width": "1168px",
          "padding": "100px 40px 24px 40px",
          "background": {
            "backgroundColor": "/Black",
            "borderRadius": "16px",
            "decorations": [
              {
                "type": "Ellipse",
                "width": "658px",
                "height": "548px",
                "position": "top-left (-186px, -246px)",
                "opacity": "0.24",
                "gradient": "Purple/Pink"
              },
              {
                "type": "Ellipse",
                "position": "bottom-right (590px, -86px)",
                "opacity": "0.18"
              },
              {
                "type": "Background overlay",
                "opacity": "0.4"
              }
            ]
          },
          "sections": [
            {
              "name": "CTA Section",
              "gap": "32px",
              "tag": {
                "text": "Join the AI Revolution",
                "variant": "Secondary"
              },
              "title": {
                "text": "Ready to start your AI journey with us?",
                "style": "/Heading 1",
                "color": "/White"
              },
              "buttons": {
                "layout": "horizontal",
                "gap": "16px",
                "items": [
                  {
                    "text": "Get Started",
                    "variant": "Primary",
                    "link": "/contact"
                  },
                  {
                    "text": "Book a Demo",
                    "variant": "Secondary-2",
                    "link": "mailto:someone@yoursite.com"
                  }
                ]
              }
            },
            {
              "name": "Separator",
              "type": "Line",
              "opacity": "0.15",
              "backgroundColor": "/White",
              "height": "1px"
            },
            {
              "name": "Links Container",
              "layout": "horizontal space-between",
              "columns": [
                {
                  "type": "Brand Column",
                  "maxWidth": "220px",
                  "gap": "32px",
                  "logo": {
                    "icon": "40x40 white background",
                    "text": "Fluence Ai",
                    "tagline": "Manage Ai effortlessly"
                  },
                  "socialMedia": {
                    "component": "SocialIcon (QHEirBxhV)",
                    "layout": "horizontal",
                    "gap": "16px",
                    "size": "30x30",
                    "icons": [
                      {"platform": "Facebook", "link": "facebook.com"},
                      {"platform": "X", "link": "x.com"},
                      {"platform": "Instagram", "link": "instagram.com"},
                      {"platform": "LinkedIn", "link": "linkedin.com"}
                    ]
                  }
                },
                {
                  "type": "Links Column",
                  "title": "Use Link",
                  "style": "/Body 16 m",
                  "links": {
                    "component": "FooterLink (heKyzYayd)",
                    "gap": "8px",
                    "items": [
                      {"text": "Feature", "href": "/#feature"},
                      {"text": "About", "href": "/#about"},
                      {"text": "Testimonial", "href": "/#testimonial"},
                      {"text": "Pricing", "href": "/#pricing"},
                      {"text": "Contact", "href": "/contact"},
                      {"text": "Blog", "href": "/blog"},
                      {"text": "404", "href": "/404"}
                    ]
                  }
                },
                {
                  "type": "Company Column",
                  "title": "Company",
                  "address": {
                    "text": "105 North 1st Street, #28, San Jose, CA 94748",
                    "style": "/Body 16",
                    "opacity": "0.7"
                  }
                }
              ]
            },
            {
              "name": "Copyright Section",
              "layout": "horizontal space-between",
              "left": {
                "text": "© 2025 Design & Developed by Amani",
                "link": "https://x.com/hello_amani",
                "linkOpenInNewTab": true,
                "style": "/Body 16"
              },
              "right": {
                "component": "FooterLink",
                "text": "Privacy Policy",
                "link": "/privacy-policy"
              }
            },
            {
              "name": "Large Background Logo",
              "type": "Decorative SVG",
              "locked": true,
              "position": "bottom center (50px from bottom)",
              "width": "100%",
              "height": "182px",
              "aspectRatio": "5.978",
              "opacity": "0.1",
              "text": "FLUENCE AI",
              "gradient": "Linear from bottom (transparent) to top (white)"
            }
          ]
        },
        "Tablet (kaCOhrfJ4)": {
          "width": "778px",
          "padding": "120px 40px 30px 40px"
        },
        "Phone (YczjDZfk8)": {
          "width": "374px",
          "padding": "64px 16px 16px 16px",
          "stackDirection": "vertical"
        }
      }
    },
    "Feature Card": {
      "nodeId": "sRL5Z3eVx",
      "description": "Card présentant une fonctionnalité",
      "variants": {
        "DesktopLeft (l07xDQast)": {
          "width": "1140px",
          "height": "526px",
          "backgroundColor": "/White",
          "borderRadius": "16px",
          "padding": "16px",
          "gap": "60px",
          "layout": "horizontal center",
          "structure": {
            "image": {
              "position": "left",
              "width": "528px",
              "height": "1fr",
              "aspectRatio": "1.069",
              "borderRadius": "8px"
            },
            "content": {
              "position": "right",
              "width": "1fr",
              "padding": "0 0 0 44px",
              "gap": "32px",
              "title": {
                "style": "/Heading 3",
                "default": "Seamless Data Integration Process"
              },
              "description": {
                "style": "/Body 16",
                "default": "Effortlessly connect with diverse data sources..."
              },
              "features": {
                "component": "FeatureItem (hTwrW1_F0)",
                "gap": "16px",
                "count": 3
              }
            }
          }
        },
        "DesktopRight (c5bMCtMfl)": {
          "similar": "DesktopLeft",
          "structure": {
            "image": "right",
            "content": "left"
          }
        },
        "TabLeft (esY812fwU)": {
          "width": "810px",
          "height": "fit-content",
          "gap": "24px",
          "padding": "24px"
        },
        "TabRight (aDebCEmN1)": {
          "similar": "TabLeft"
        },
        "Mobile (hV_njWmw5)": {
          "width": "390px",
          "height": "fit-content",
          "stackDirection": "vertical",
          "gap": "24px",
          "padding": "16px"
        }
      },
      "subComponents": {
        "FeatureItem (hTwrW1_F0)": {
          "width": "524px",
          "height": "fit-content",
          "layout": "horizontal start",
          "gap": "16px",
          "icon": {
            "component": "FeatureCardIcon (ijEm2GTR1)",
            "width": "32px",
            "height": "32px",
            "variants": ["thin", "light", "regular", "bold", "fill", "duotone"]
          },
          "text": {
            "style": "/Body 18 m",
            "default": "Real-Time Data Syncing"
          }
        }
      }
    },
    "Pricing/Plan": {
      "nodeId": "fTD88Tbv8",
      "description": "Carte de plan tarifaire",
      "variants": {
        "Plan1 (nxqQ7mlkO)": {
          "width": "402px",
          "height": "fit-content",
          "backgroundColor": "rgba(255,255,255,1)",
          "borderRadius": "16px",
          "padding": "24px",
          "gap": "32px",
          "structure": {
            "header": {
              "gap": "8px",
              "icon": {
                "width": "22px",
                "height": "22px",
                "type": "Star with gradient",
                "gradient": "#80AAFD with overlay"
              },
              "title": {
                "style": "/Sub Title",
                "default": "Free",
                "layout": "horizontal with icon"
              },
              "subtitle": {
                "style": "/Body 16",
                "default": "Get started with Fluence AI at no cost"
              }
            },
            "pricing": {
              "component": "PricingPlanPrice (U9QtchrTZ)",
              "gap": "24px"
            },
            "cta": {
              "component": "ButtonButton",
              "variant": "Secondary-2",
              "width": "1fr",
              "height": "50px",
              "text": "Get Started",
              "link": "/contact"
            },
            "features": {
              "title": {
                "text": "What's Included",
                "style": "/Body 16 m",
                "opacity": "0.7"
              },
              "list": {
                "component": "PricingPlanFeature (hwKT4xVnu)",
                "gap": "16px",
                "items": [
                  "400 AI credits at signup",
                  "20,000 AI token inputs",
                  "Calendar integration & syncing",
                  "Guest sharing and links"
                ]
              }
            }
          }
        },
        "Plan2 (RnqVvaD3j)": {
          "similar": "Plan1",
          "padding": "8px (border variant)",
          "highlighted": true,
          "badge": "Most Popular",
          "background": {
            "outer": "Gradient border effect",
            "inner": "/Black",
            "textColor": "/White"
          },
          "features": "More extensive list"
        },
        "Plan3 (URNhs4gTQ)": {
          "similar": "Plan1",
          "tier": "Pro",
          "features": "Most comprehensive list"
        }
      },
      "props": {
        "pflkD9rN2": "string - Plan name",
        "ShCUPCFgS": "string - Subtitle",
        "OYy1kXkEt": "variant - Monthly/Yearly toggle",
        "LcJrINR4I": "string - Price",
        "nxuxSBacu": "boolean - Highlighted"
      }
    },
    "Blog Card": {
      "nodeId": "p37PzgvSj",
      "description": "Carte d'article de blog",
      "variants": {
        "Desktop (i_cwC10h6)": {
          "width": "364px",
          "height": "fit-content",
          "backgroundColor": "rgba(255,255,255,1)",
          "borderRadius": "16px",
          "padding": "8px",
          "gap": "24px",
          "gridFillHeight": false,
          "structure": {
            "image": {
              "width": "1fr",
              "height": "254px",
              "aspectRatio": "1.37",
              "borderRadius": "12px"
            },
            "content": {
              "padding": "0 16px 16px 16px",
              "gap": "16px",
              "header": {
                "layout": "horizontal space-between",
                "tag": {
                  "component": "Tag",
                  "variant": "Blogs Tag"
                },
                "date": {
                  "style": "/Tag",
                  "default": "21/02/22"
                }
              },
              "title": {
                "style": "/Sub Title",
                "default": "Title"
              }
            }
          }
        },
        "Mobile (l9FnqFH_l)": {
          "similar": "Desktop",
          "adjustments": "Optimized for mobile"
        }
      },
      "props": {
        "QOO0OyT8t": "string - Tag text",
        "Ua4NYwwzh": "string - Date",
        "OOuAxA5lO": "string - Link URL"
      }
    },
    "Testimonial Slider": {
      "nodeId": "GIPSGi5NZ",
      "description": "Carrousel de témoignages",
      "variants": {
        "Desktop (Nq4yfGIdn)": {
          "width": "1120px",
          "height": "fit-content",
          "gap": "16px",
          "structure": {
            "slideshow": {
              "width": "650px",
              "height": "330px",
              "direction": "left",
              "autoPlayControl": false,
              "intervalControl": "1.5s",
              "dragControl": false,
              "startFrom": 0,
              "alignment": "center",
              "itemAmount": 1,
              "gap": "10px",
              "borderRadius": "0px"
            },
            "background": {
              "opacity": "0.5",
              "width": "664px",
              "height": "221px",
              "backgroundColor": "rgba(255, 255, 255, 0.5)",
              "borderRadius": "14px",
              "position": "Behind slideshow"
            }
          },
          "cards": {
            "component": "TestimonialSliderCard (l2Dz9iH2M)",
            "variant": "Desktop (Ut4kwoUNc)",
            "width": "676px",
            "items": [
              {
                "quote": "Fluence AI has revolutionized the way we process data. The seamless integration and advanced analytics tools have saved us countless hours and improved our decision-making",
                "author": "Sarah J.",
                "role": "Data Analyst, TechCorp"
              },
              {
                "quote": "The automation features in Fluence AI have made our workflows so much more efficient. We're now able to focus on high-priority tasks while the system handles the rest",
                "author": "Mark L.",
                "role": "Operations Manager, GrowthTech"
              },
              {
                "quote": "Thanks to Fluence AI, we now make data-driven decisions in real time. The predictive analytics have helped us forecast trends and stay ahead of the competition",
                "author": "Emily R.",
                "role": "Marketing Director, InnovateCo"
              }
            ]
          }
        },
        "Tab (d1qMfLvmk)": {
          "similar": "Desktop",
          "responsive": true
        },
        "Mobile (W2nRzZk4m)": {
          "width": "390px",
          "adjustments": "Mobile optimized"
        }
      }
    },
    "Accordion/FAQ": {
      "nodeId": "LPj45F3ii",
      "description": "Item FAQ avec expand/collapse",
      "variants": {
        "Closed (uBkNmHzNV)": {
          "width": "400px",
          "height": "fit-content",
          "backgroundColor": "/Gray",
          "borderRadius": "8px",
          "padding": "20px",
          "structure": {
            "question": {
              "layout": "horizontal start",
              "gap": "24px",
              "icon": {
                "component": "AccordionIcon (hDaqqPDsW)",
                "variant": "Open (xX1RAZS8z)",
                "width": "16px",
                "height": "16px"
              },
              "text": {
                "style": "/Sub Title",
                "gridFillWidth": false,
                "gridFillHeight": false
              }
            }
          }
        },
        "Open (sG3NVwXcH)": {
          "similar": "Closed",
          "gap": "16px (includes answer)",
          "structure": {
            "question": "Same as Closed",
            "answer": {
              "style": "/Body 16",
              "opacity": "0.8",
              "padding": "top"
            },
            "icon": {
              "variant": "Close (D24kQElLr)",
              "rotation": "180deg or animation"
            }
          }
        }
      },
      "props": {
        "W88zB8mIG": "string - Question text",
        "T8rQFvSBR": "string - Answer text"
      }
    },
    "Number Card": {
      "nodeId": "OOkc5DYL8",
      "description": "Carte avec compteur animé",
      "variants": {
        "Desktop (X2NRjuPfh)": {
          "width": "290.5px",
          "height": "fit-content",
          "layout": "vertical center",
          "structure": {
            "counter": {
              "startOnViewport": true,
              "restartOnViewport": false,
              "textSize": "44px",
              "textColor": "rgb(27, 12, 37)",
              "decimalSeparatorType": "none",
              "incrementType": "integer",
              "prefixText": "",
              "prefixColor": "rgb(27, 12, 37)",
              "suffixColor": "rgb(27, 12, 37)",
              "gapSize": "0",
              "speed": "88",
              "loop": false,
              "endValue": "Dynamic (50+, 1000+, etc)"
            },
            "description": {
              "text": "Apps & services, and growing.",
              "font": "FS;General Sans-regular"
            }
          }
        },
        "Mobile (lcSfcq4vA)": {
          "similar": "Desktop",
          "alignment": "start"
        }
      }
    },
    "Step": {
      "nodeId": "SabNg7qKY",
      "description": "Carte de processus/étape",
      "variant": {
        "Variant1 (veWqGJJ6c)": {
          "width": "364px",
          "height": "fit-content",
          "backgroundColor": "rgba(255,255,255,1)",
          "borderRadius": "16px",
          "padding": "8px",
          "gap": "30px",
          "gridFillHeight": false,
          "structure": {
            "image": {
              "width": "1fr",
              "height": "254px",
              "aspectRatio": "1.37",
              "borderRadius": "12px"
            },
            "content": {
              "padding": "0 22px 22px 22px",
              "gap": "16px",
              "title": {
                "style": "/Sub Title",
                "default": "Title"
              },
              "description": {
                "style": "/Body 16",
                "default": "Body"
              }
            }
          }
        }
      }
    },
    "Ticker Desktop": {
      "nodeId": "XRWPqwehD",
      "description": "Bande défilante horizontale",
      "structure": {
        "width": "1140px",
        "maxWidth": "1240px",
        "gap": "24px",
        "ticker": {
          "width": "1fr",
          "height": "200px",
          "speed": "70",
          "direction": "left",
          "alignment": "center",
          "gap": "0",
          "hoverFactor": "1"
        },
        "repeatingElements": [
          {
            "type": "Text",
            "content": "Request a demo",
            "link": "https://www.framer.com?via=amani_design",
            "linkOpenInNewTab": true
          },
          {
            "type": "Icon",
            "width": "250px",
            "height": "250px",
            "aspectRatio": "1",
            "svg": "AI logo with 3D effect and gradients"
          }
        ],
        "pattern": "Text - Icon - Text - Icon (repeating)"
      }
    },
    "Pricing/Main": {
      "nodeId": "ivMW7eXD4",
      "description": "Container principal de la section pricing",
      "variants": {
        "Monthly (NHPR5gkNi)": {
          "width": "1140px",
          "gap": "24px",
          "structure": {
            "header": {
              "gap": "40px",
              "tag": "Pricing",
              "title": "Simple, Flexible Pricing",
              "description": "Pricing plans for businesses at every stage of growth.",
              "toggle": {
                "component": "Toggle (iERezogGn)",
                "variant": "Monthly (yqTWLOfWe)"
              }
            },
            "plans": {
              "layout": "horizontal",
              "gap": "24px",
              "components": [
                {"plan": "Starter", "variant": "nxqQ7mlkO", "price": "Free"},
                {"plan": "Plus", "variant": "RnqVvaD3j", "price": "$22", "highlighted": true},
                {"plan": "Pro", "variant": "URNhs4gTQ", "price": "$69"}
              ]
            }
          }
        },
        "Yearly (JM8dfvrnw)": {
          "similar": "Monthly",
          "pricing": "Annual pricing with discount",
          "toggle": "Yearly (RvfakH4Nz)"
        }
      }
    }
  },

  "animations": {
    "pageLoad": {
      "hero": "Fade in from opacity 0",
      "navigation": "Slide down from top"
    },
    "onScroll": {
      "sections": "Fade in when 20% in viewport",
      "cards": "Slide up + fade in",
      "counters": "Animate from 0 to target value"
    },
    "interactions": {
      "buttonHover": {
        "type": "Vertical text slide",
        "duration": "200ms",
        "easing": "ease-out",
        "description": "Text1 slides up, Text2 slides in from below"
      },
      "cardHover": {
        "type": "Scale + shadow",
        "transform": "scale(1.02)",
        "shadow": "Increase blur and spread",
        "duration": "300ms"
      },
      "linkHover": {
        "type": "Opacity change",
        "from": "1",
        "to": "0.7",
        "duration": "200ms"
      },
      "accordionToggle": {
        "type": "Height expand + icon rotate",
        "icon": "Rotate 180deg",
        "content": "Height 0 to auto",
        "duration": "300ms",
        "easing": "ease-in-out"
        {
  "projectInfo": {
    "name": "Fluence AI",
    "description": "Site web moderne pour une solution d'intelligence artificielle - Full Stack Landing Page",
    "liveUrl": "https://philosophical-state-421641.framer.app/",
    "stagingUrl": "https://philosophical-state-421641.framer.app/",
    "lastDeployment": "2025-12-08",
    "totalPages": 6,
    "totalComponents": 35,
    "designSystem": "Minimalist, Modern AI-focused design"
  },

  "reactExport": {
    "method": "Framer React Export Plugin",
    "cliCommand": "npx -y unframer example-app <projectId>",
    "documentation": "https://github.com/remorses/unframer",
    "outputFormat": {
      "files": ".jsx components + .css styles",
      "structure": "Machine-generated React components",
      "customization": "Framer variables → React props"
    },
    "componentUrls": {
      "Tag": "https://framer.com/m/Tag-yria.js",
      "note": "Chaque composant a une URL d'import unique"
    },
    "installation": {
      "step1": "npm install -g unframer",
      "step2": "unframer login (use same Google account as Framer)",
      "step3": "npx -y unframer example-app <projectId>",
      "step4": "cd example-app && npm install",
      "step5": "npm run dev"
    }
  },

  "colorSystem": {
    "palette": {
      "neutrals": {
        "/Black": {
          "value": "rgb(27, 12, 37)",
          "usage": "Primary text, dark backgrounds, footer",
          "contrast": "High contrast with white"
        },
        "/White": {
          "value": "rgb(255, 255, 255)",
          "usage": "Cards, backgrounds, text on dark",
          "opacity_variants": ["1", "0.6", "0.5", "0.26", "0.2", "0.1"]
        },
        "/Gray Dark": {
          "value": "rgb(237, 235, 238)",
          "usage": "Borders, separators, disabled states"
        },
        "/Gray": {
          "value": "rgb(247, 246, 247)",
          "usage": "Page background, card backgrounds"
        }
      },
      "accents_light": {
        "/Blue Lite": "rgb(223, 233, 253)",
        "/Purple Lite": "rgb(234, 226, 242)",
        "/Orange Lite": "rgb(247, 230, 221)",
        "/Pink Lite": "rgb(245, 228, 239)"
      },
      "accents": {
        "/Blue": "rgb(128, 170, 253)",
        "/Purple": "rgb(211, 123, 255)",
        "/Orange": "rgb(252, 172, 132)",
        "/Pink": "rgb(255, 130, 225)"
      },
      "gradients": {
        "primary": {
          "type": "linear-gradient",
          "stops": [
            {"offset": "0%", "color": "#F0E9F7"},
            {"offset": "60.8%", "color": "#D588FC"},
            {"offset": "100%", "color": "#FF49D4"}
          ],
          "usage": "Logo, icons, decorative elements"
        },
        "secondary": {
          "type": "linear-gradient",
          "stops": [
            {"offset": "0.21", "color": "white"},
            {"offset": "0.68", "color": "#D588FC"},
            {"offset": "1", "color": "#FF49D4"}
          ],
          "usage": "Logo alternative"
        },
        "multi": {
          "stops": [
            {"color": "#7AA7FF", "position": "start"},
            {"color": "#CC65FF", "position": "31.087%"},
            {"color": "#FF9C6A", "position": "70.46%"},
            {"color": "#FF49D4", "position": "end"}
          ],
          "usage": "Icons, decorative elements"
        }
      }
    }
  },

  "typography": {
    "fontFamily": {
      "primary": "General Sans",
      "source": "Fontsource (FS;General Sans-*)",
      "weights": ["regular", "medium"],
      "fallback": "system-ui, -apple-system, sans-serif"
    },
    "textStyles": {
      "/Heading 1": {
        "font": "FS;General Sans-medium",
        "fontSize": "76px",
        "lineHeight": "1em",
        "letterSpacing": "0px",
        "tag": "h1",
        "responsive": {
          "tablet": "60px",
          "mobile": "44px"
        },
        "usage": "Hero titles, main headlines"
      },
      "/Heading 2": {
        "fontSize": "60px",
        "lineHeight": "1em",
        "paragraphSpacing": "40px",
        "tag": "h2",
        "responsive": {
          "tablet": "48px",
          "mobile": "36px"
        },
        "usage": "Section titles"
      },
      "/Heading 3": {
        "fontSize": "44px",
        "lineHeight": "1.2em",
        "tag": "h3",
        "responsive": {
          "tablet": "36px",
          "mobile": "28px"
        },
        "usage": "Subsection titles, feature cards"
      },
      "/Heading 4": {
        "fontSize": "32px",
        "lineHeight": "1.2em",
        "tag": "h4",
        "responsive": {
          "tablet": "28px",
          "mobile": "24px"
        },
        "usage": "Card titles, content blocks"
      },
      "/Sub Title": {
        "fontSize": "24px",
        "lineHeight": "1.2em",
        "tag": "h4",
        "usage": "Subtitles, pricing plans, blog cards"
      },
      "/Body 18": {
        "font": "FS;General Sans-regular",
        "fontSize": "18px",
        "lineHeight": "28px",
        "tag": "p",
        "usage": "Large body text, descriptions"
      },
      "/Body 18 m": {
        "font": "FS;General Sans-medium",
        "fontSize": "18px",
        "lineHeight": "28px",
        "usage": "Emphasized body text"
      },
      "/Body 16": {
        "fontSize": "16px",
        "lineHeight": "26px",
        "paragraphSpacing": "20px",
        "usage": "Standard body text, most content"
      },
      "/Body 16 m": {
        "fontSize": "16px",
        "lineHeight": "26px",
        "weight": "medium",
        "usage": "Button text, emphasized content"
      },
      "/Body 14": {
        "fontSize": "14px",
        "lineHeight": "22px",
        "usage": "Small text, captions, metadata"
      },
      "/Tag": {
        "fontSize": "14px",
        "lineHeight": "16px",
        "letterSpacing": "0px",
        "transform": "uppercase",
        "weight": "medium",
        "usage": "Tags, badges, labels"
      }
    }
  },

  "layoutSystem": {
    "breakpoints": {
      "desktop": {
        "min": "1200px",
        "maxContentWidth": "1240px",
        "padding": "140px-160px vertical, 16px-40px horizontal"
      },
      "tablet": {
        "width": "810px",
        "padding": "80px-120px vertical, 30px horizontal"
      },
      "mobile": {
        "width": "390px",
        "padding": "64px vertical, 16px horizontal"
      }
    },
    "spacing": {
      "sections": {
        "large": "160px",
        "medium": "100px-140px",
        "small": "60px-80px"
      },
      "cards": {
        "outer": "24px-40px",
        "inner": "16px-32px"
      },
      "elements": {
        "large": "24px-32px",
        "medium": "16px",
        "small": "8px-12px"
      }
    },
    "borderRadius": {
      "pills": "99px-999px (tags, toggle buttons)",
      "cards": "16px (feature cards, pricing)",
      "medium": "12px-14px (images, containers)",
      "small": "8px (buttons, inputs)"
    },
    "stackLayouts": {
      "vertical": {
        "distribution": ["start", "center", "end", "space-between"],
        "alignment": ["start", "center", "end"],
        "gaps": ["8px", "12px", "16px", "24px", "32px", "40px", "60px", "100px", "160px"]
      },
      "horizontal": {
        "distribution": ["start", "center", "end", "space-between", "space-around", "space-evenly"],
        "alignment": ["start", "center", "end"],
        "wrap": true
      }
    },
    "gridLayouts": {
      "columns": {
        "auto-fill": "Automatic based on gridColumnWidth",
        "fixed": "1, 2, 3 columns"
      },
      "gaps": ["10px", "16px", "20px", "24px"],
      "itemSpanning": {
        "columnSpan": "1, 2, 3, or 'all'",
        "rowSpan": "1, 2, 3+"
      }
    }
  },

  "pages": {
    "home": {
      "path": "/",
      "nodeId": "augiA20Il",
      "description": "Main landing page - full sections breakdown",
      "sections": [
        {
          "id": "hero",
          "anchor": null,
          "type": "Hero Section",
          "background": "Gradient with decorative elements",
          "layout": "Centered vertical stack",
          "elements": [
            {
              "type": "Navigation",
              "component": "Navigation",
              "variant": "Desktop/Phone",
              "position": "Sticky top",
              "backgroundColor": "rgba(255, 255, 255, 0.1)"
            },
            {
              "type": "Tag",
              "text": "Transform Your Business with AI",
              "variant": "Primary"
            },
            {
              "type": "Heading",
              "text": "Empower Your Business\nWith AI-Driven\nIntelligence",
              "style": "/Heading 1",
              "maxWidth": "900px"
            },
            {
              "type": "Description",
              "text": "Fluence AI helps you integrate...",
              "style": "/Body 18",
              "maxWidth": "700px"
            },
            {
              "type": "CTA Buttons",
              "layout": "Horizontal stack, gap 16px",
              "buttons": [
                {"text": "Get Started", "variant": "Primary", "link": "/contact"},
                {"text": "Book a Demo", "variant": "Secondary"}
              ]
            },
            {
              "type": "Hero Chat UI",
              "component": "PYdd9YjCc + D3A2I9bWQ",
              "description": "Interactive chat interface mockup"
            }
          ]
        },
        {
          "id": "ticker",
          "type": "Ticker Section",
          "component": "TickerDesktop / TickerMobile",
          "nodeId": "XRWPqwehD",
          "content": {
            "text": "Request a demo",
            "icon": "AI logo (300x300)",
            "animation": "Continuous horizontal scroll",
            "speed": "70px/s",
            "direction": "left",
            "gap": "0px"
          },
          "decoration": {
            "icons": ["Gradient AI logo", "decorative elements"],
            "links": "https://www.framer.com?via=amani_design"
          }
        },
        {
          "id": "stats",
          "anchor": "#about",
          "type": "Statistics Section",
          "background": "/White",
          "layout": "3 columns grid",
          "components": [
            {
              "component": "NumberCard",
              "nodeId": "OOkc5DYL8",
              "props": {
                "number": "Counter animation (88 speed)",
                "suffix": "+",
                "text": "Apps & services, and growing.",
                "alignment": "center/start"
              }
            }
          ],
          "note": "3 identical NumberCard components with different numbers"
        },
        {
          "id": "features",
          "anchor": "#feature",
          "type": "Features Section",
          "header": {
            "tag": "Features",
            "title": "Powerful Features to\nDrive Your Growth",
            "description": "Explore the comprehensive suite of features..."
          },
          "layout": "Vertical stack of feature cards",
          "cards": [
            {
              "component": "Feature Card",
              "nodeId": "sRL5Z3eVx",
              "variant": "DesktopLeft",
              "structure": {
                "image": "Left side, 528px, aspect 1.069",
                "content": {
                  "title": "Seamless Data Integration Process",
                  "description": "Effortlessly connect with diverse data sources...",
                  "features": [
                    "FeatureItem: Real-Time Data Syncing",
                    "FeatureItem: Multi-Platform Support",
                    "FeatureItem: Secure Data Transfer"
                  ]
                }
              }
            },
            {
              "variant": "DesktopRight",
              "note": "Image on right side, text on left"
            },
            {
              "variant": "DesktopLeft",
              "note": "Alternating layout"
            }
          ]
        },
        {
          "id": "how-it-works",
          "type": "Process Section",
          "header": {
            "tag": "How it works",
            "title": "Get Started in Three\nSimple Steps",
            "description": "Our streamlined process makes it easy..."
          },
          "steps": [
            {
              "component": "Step",
              "nodeId": "SabNg7qKY",
              "structure": {
                "image": "254px height, aspect 1.37, radius 12px",
                "title": "Connect Your Data Sources",
                "description": "Link your existing tools and platforms...",
                "padding": "8px, content 22px"
              }
            }
          ],
          "layout": "Grid, 3 columns, gap 24px"
        },
        {
          "id": "testimonials",
          "anchor": "#testimonial",
          "type": "Testimonials Section",
          "component": "TestimonialSlider",
          "nodeId": "GIPSGi5NZ",
          "header": {
            "tag": "Customer love",
            "title": "What Our Customers Say",
            "description": "Hear from businesses that transformed..."
          },
          "slider": {
            "width": "650px",
            "height": "330px",
            "direction": "left",
            "autoPlay": false,
            "interval": "1.5s",
            "drag": false,
            "itemAmount": 1,
            "gap": "10px",
            "cards": [
              {
                "quote": "Fluence AI has revolutionized the way we process data...",
                "author": "Sarah J.",
                "role": "Data Analyst, TechCorp"
              },
              {
                "quote": "The automation features in Fluence AI have made our workflows...",
                "author": "Mark L.",
                "role": "Operations Manager, GrowthTech"
              },
              {
                "quote": "Thanks to Fluence AI, we now make data-driven decisions...",
                "author": "Emily R.",
                "role": "Marketing Director, InnovateCo"
              }
            ]
          },
          "background": {
            "blur": "rgba(255, 255, 255, 0.5)",
            "opacity": "0.5",
            "radius": "14px"
          }
        },
        {
          "id": "pricing",
          "anchor": "#pricing",
          "type": "Pricing Section",
          "component": "Pricing / PricingMain",
          "nodeId": "RVU2jNR6F / ivMW7eXD4",
          "header": {
            "tag": "Pricing",
            "title": "Simple, Flexible Pricing",
            "description": "Pricing plans for businesses at every stage of growth."
          },
          "toggle": {
            "component": "Toggle",
            "nodeId": "iERezogGn",
            "variants": ["Monthly (yqTWLOfWe)", "Yearly (RvfakH4Nz)"],
            "default": "Monthly"
          },
          "plans": [
            {
              "name": "Starter (Free)",
              "component": "PricingPlan (fTD88Tbv8)",
              "variant": "Plan1 (nxqQ7mlkO)",
              "icon": "Star gradient",
              "subtitle": "Get started with Fluence AI at no cost",
              "price": {
                "monthly": "Free",
                "yearly": "Free",
                "component": "PricingPlanPrice (U9QtchrTZ)"
              },
              "cta": {
                "text": "Get Started",
                "variant": "Secondary-2",
                "link": "/contact"
              },
              "features": [
                "400 AI credits at signup",
                "20,000 AI token inputs",
                "Calendar integration & syncing",
                "Guest sharing and links"
              ],
              "highlighted": false
            },
            {
              "name": "Plus",
              "variant": "Plan2 (RnqVvaD3j)",
              "price": "$22",
              "highlighted": true,
              "badge": "Most Popular",
              "backgroundColor": "/Black",
              "textColor": "/White",
              "features": [
                "Everything in Starter",
                "50,000 AI token inputs",
                "Priority support",
                "Advanced analytics"
              ]
            },
            {
              "name": "Pro",
              "variant": "Plan3 (URNhs4gTQ)",
              "price": "$69",
              "subtitle": "Take your business to the next level",
              "features": [
                "Everything in Plus",
                "Unlimited AI tokens",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantee"
              ]
            }
          ],
          "layout": "Horizontal stack, 3 cards, gap 24px",
          "responsive": {
            "tablet": "Vertical stack",
            "mobile": "Vertical stack, full width"
          }
        },
        {
          "id": "faq",
          "anchor": "#faq",
          "type": "FAQ Section",
          "component": "Main (Accordion wrapper)",
          "nodeId": "ookRBWkBa",
          "header": {
            "tag": "FAQ",
            "title": "Frequently Asked Questions",
            "description": "Find answers to common questions..."
          },
          "questions": [
            {
              "question": "What is Fluence AI?",
              "answer": "Fluence AI is a powerful platform designed to help businesses integrate, analyze, and automate data workflows using artificial intelligence. It empowers teams to make smarter decisions and drive growth through seamless data management.",
              "default": "closed"
            },
            {
              "question": "Can I integrate Fluence AI with my existing tools?",
              "answer": "Yes! Fluence AI supports integration with a wide range of tools and platforms. Our flexible APIs allow you to connect with your data sources effortlessly, enabling a smooth workflow.",
              "default": "open"
            },
            {
              "question": "How does Fluence AI automate tasks?",
              "answer": "Fluence AI uses AI-driven workflows to automate repetitive tasks such as data processing, reporting, and notifications. This helps save time and boosts productivity for your team."
            },
            {
              "question": "Is my data secure with Fluence AI?",
              "answer": "Absolutely! Fluence AI takes security seriously. We use enterprise-grade encryption to protect your data, ensuring that it's secure at all stages, from integration to processing."
            },
            {
              "question": "What kind of support do you offer?",
              "answer": "We offer 24/7 support via email for all users, with additional live chat and priority support for Plus and Pro plan subscribers. Our team is always ready to assist with any questions or issues you may have."
            }
          ]
        },
        {
          "id": "footer",
          "type": "Footer",
          "component": "Footer (FBO9CnB_6)",
          "description": "See full footer structure in components section"
        }
      ]
    },
    "contact": {
      "path": "/contact",
      "nodeId": "G9kMkT9Mv",
      "description": "Contact page with form",
      "expectedSections": [
        "Header with tag and title",
        "Contact form with fields",
        "Contact information",
        "Map or illustration"
      ]
    },
    "404": {
      "path": "/404",
      "nodeId": "yPBWQ56a0",
      "fullStructure": {
        "background": "/Gray",
        "hero": {
          "width": "full viewport",
          "height": "100vh",
          "maxWidth": "1920px",
          "borderRadius": "16px",
          "backgroundImage": "https://framerusercontent.com/images/ChLYQp9qidYmBasL0Sih4gYbmM.png",
          "padding": "40px",
          "layout": "Centered"
        },
        "content": {
          "container": {
            "maxWidth": "390px",
            "gap": "40px",
            "centered": true
          },
          "title": {
            "text": "404",
            "font": "FS;General Sans-medium",
            "size": "Very large"
          },
          "description": {
            "text": "Hmmmm... I couldn't find that page. It's just me playing the guitar :)",
            "style": "/Body 16"
          },
          "button": {
            "component": "ButtonButton",
            "variant": "Secondary (RYQOdgXwu)",
            "text": "Back to home",
            "link": "/",
            "width": "200px",
            "height": "50px"
          }
        }
      }
    },
    "privacy-policy": {
      "path": "/privacy-policy",
      "nodeId": "nm0D4XlxB",
      "fullStructure": {
        "background": "/Gray",
        "maxWidth": "1140px",
        "padding": "140px 16px",
        "sections": [
          {
            "header": {
              "tag": {"text": "Privacy Policy", "variant": "Secondary"},
              "title": "Privacy Policy",
              "subtitle": "Last Updated: November 15, 2024"
            }
          },
          {
            "title": "Information We Collect",
            "content": "We collect data to ensure seamless interactions..."
          },
          {
            "title": "How We Use Your Data",
            "content": "The information you share with us..."
          },
          {
            "title": "Your Rights",
            "content": "We believe in empowering users..."
          },
          {
            "title": "Data Protection",
            "content": "We employ state-of-the-art measures..."
          },
          {
            "title": "Contact Us",
            "content": "If you have questions..."
          }
        ]
      }
    },
    "blog": {
      "path": "/blog",
      "nodeId": "g6WCdQaSj",
      "structure": {
        "background": "/Gray",
        "padding": "160px 20px",
        "header": {
          "tag": "Blog",
          "title": "Explore Our Blog And Stay Updated"
        },
        "grid": {
          "component": "BlogCard",
          "layout": "Horizontal stack",
          "gap": "24px"
        }
      }
    },
    "blog-post": {
      "path": "/blog/:slug",
      "nodeId": "VB04Dwgbu",
      "dynamic": true,
      "cmsIntegration": true
    }
  },

  "components": {
    "Tag": {
      "nodeId": "Ihf4JO3wW",
      "importUrl": "https://framer.com/m/Tag-yria.js",
      "variants": {
        "Primary": {
          "backgroundColor": "rgba(255, 255, 255, 0.2)",
          "icon": "Star gradient",
          "usage": "Dark backgrounds"
        },
        "Secondary": {
          "backgroundColor": "rgba(255, 255, 255, 1)",
          "usage": "Light backgrounds"
        }
      }
    },
    "Button/Button": {
      "nodeId": "YBPGh7qim",
      "variants": {
        "Primary": {
          "backgroundColor": "/Black",
          "animation": "Vertical slide on hover"
        },
        "Secondary": {
          "backgroundColor": "rgba(255, 255, 255, 0.26)"
        },
        "Secondary-2": {
          "backgroundColor": "rgb(255, 255, 255)"
        },
        "Small": {
          "width": "120px",
          "height": "36px"
        }
      }
    }
  },

  "animations": {
    "pageLoad": {
      "hero": "Fade in",
      "navigation": "Slide down"
    },
    "onScroll": {
      "sections": "Fade in at 20% viewport",
      "counters": "Animate from 0"
    },
    "interactions": {
      "buttonHover": "Vertical text slide (200ms)",
      "cardHover": "Scale 1.02 + shadow (300ms)",
      "linkHover": "Opacity 0.7 (200ms)",
      "accordionToggle": "Height expand + icon rotate (300ms)"
    }
  },

  "technicalImplementation": {
    "framerXML": {
      "description": "Structure XML complète de chaque composant",
      "attributes": {
        "layout": {
          "stack": "Flexbox-like (vertical/horizontal)",
          "grid": "CSS Grid-like",
          "null": "Absolute positioning"
        },
        "sizing": {
          "width": "CSS units (px, %, vw, fr, fit-content, rem, em)",
          "height": "CSS units",
          "aspectRatio": "Number (e.g., 1.5)",
          "minWidth": "Pixels only",
          "maxWidth": "Pixels only"
        },
        "positioning": {
          "absolute": "With top/right/bottom/left or centerX/centerY",
          "relative": "Flow positioning",
          "fixed": "Fixed to viewport",
          "sticky": "Sticky positioning"
        },
        "styling": {
          "backgroundColor": "Color string or style path (/StyleName)",
          "borderRadius": "CSS border radius",
          "backgroundImage": "Image URL (auto-uploaded to Framer)",
          "opacity": "0-1"
        },
        "stack": {
          "stackDirection": "horizontal | vertical",
          "stackDistribution": "start | center | end | space-between | space-around | space-evenly",
          "stackAlignment": "start | center | end",
          "gap": "Pixels (single value or 'rowGap columnGap')",
          "padding": "Pixels (1 or 4 values)",
          "stackWrap": "Boolean"
        },
        "grid": {
          "gridColumns": "Number or 'auto-fill'",
          "gridRows": "Number",
          "gridAlignment": "start | center | end",
          "gridColumnWidthType": "fixed | minmax",
          "gridColumnWidth": "Pixels (number only)",
          "gridColumnMinWidth": "Pixels (number only)",
          "gridRowHeightType": "fixed | auto | fit",
          "gridRowHeight": "Pixels (number only)"
        },
        "text": {
          "font": "Font selector (e.g., 'FS;General Sans-medium')",
          "inlineTextStyle": "Project text style path (e.g., '/Heading 1')"
        },
        "link": {
          "link": "URL or page path",
          "linkOpenInNewTab": "Boolean"
        }
      }
    },
    "componentSystem": {
      "variants": "Multiple design variants per component",
      "props": "Custom properties passed to component instances",
      "nesting": "Components can contain other components",
      "responsive": "Desktop/Tablet/Phone variants"
    },
    "imageHandling": {
      "hosting": "framerusercontent.com",
      "upload": "External URLs auto-uploaded on import",
      "optimization": "Automatic Framer optimization",
      "aspectRatio": "Preserved to prevent layout shift"
    }
  },

  "recreationGuide": {
    "forClaudeCLI": {
      "step1_setup": {
        "task": "Initialize Next.js + Tailwind project",
        "commands": [
          "npx create-next-app@latest fluence-ai-clone",
          "cd fluence-ai-clone",
          "npm install"
        ]
      },
      "step2_typography": {
        "task": "Install General Sans font",
        "method": "Add @fontsource/general-sans or use CDN",
        "css": "@import url('https://fonts.googleapis.com/css2?family=General+Sans:wght@400;500&display=swap');"
      },
      "step3_colorSystem": {
        "task": "Configure Tailwind colors",
        "file": "tailwind.config.js",
        "colors": {
          "primary": "#1B0C25",
          "white": "#FFFFFF",
          "gray": {
            "light": "#F7F6F7",
            "dark": "#EDEBEE"
          },
          "accent": {
            "blue": "#80AAFD",
            "purple": "#D37BFF",
            "orange": "#FCAC84",
            "pink": "#FF82E1"
          }
        }
      },
      "step4_components": {
        "task": "Create component library",
        "priority": [
          "Button (with hover animation)",
          "Tag (with variants)",
          "Navigation (responsive)",
          "Footer (complex structure)",
          "FeatureCard (image + content)",
          "PricingCard (with toggle)",
          "BlogCard",
          "TestimonialSlider (Swiper.js)",
          "Accordion/FAQ",
          "NumberCard (with counter animation)"
        ]
      },
      "step5_pages": {
        "task": "Build pages",
        "order": [
          "Home (all sections)",
          "404",
          "Privacy Policy",
          "Blog",
          "Blog Post (dynamic)",
          "Contact"
        ]
      },
      "step6_animations": {
        "task": "Implement animations",
        "library": "Framer Motion",
        "animations": [
          "Fade in on scroll (Intersection Observer)",
          "Button hover (vertical text slide)",
          "Counter animation (react-countup)",
          "Accordion expand/collapse",
          "Ticker scroll (infinite loop)"
        ]
      },
      "step7_responsive": {
        "task": "Implement responsive design",
        "breakpoints": {
          "mobile": "max-width: 767px",
          "tablet": "768px - 1199px",
          "desktop": "min-width: 1200px"
        }
      },
      "step8_optimization": {
        "task": "Performance optimization",
        "actions": [
          "Image optimization (next/image)",
          "Lazy loading",
          "Code splitting",
          "SEO meta tags"
        ]
      }
    },
    "keyImplementationDetails": {
      "buttonHoverAnimation": {
        "description": "Dual text layers with vertical slide",
        "implementation": "overflow: hidden + transform: translateY() on hover",
        "html": "<button><span class='text-wrapper'><span class='text-1'>Text</span><span class='text-2'>Text</span></span></button>",
        "css": ".text-wrapper { display: flex; flex-direction: column; transition: transform 0.3s; } button:hover .text-wrapper { transform: translateY(-100%); }"
      },
      "counterAnimation": {
        "description": "Animate numbers from 0 to target",
        "implementation": "Use react-countup or custom requestAnimationFrame",
        "trigger": "Intersection Observer when in viewport",
        "duration": "2-3 seconds"
      },
      "tickerAnimation": {
        "description": "Infinite horizontal scroll",
        "implementation": "CSS animation or JavaScript",
        "pattern": "Text - Icon - Text - Icon (repeating)",
        "speed": "70px/s"
      },
      "accordionAnimation": {
        "description": "Smooth expand/collapse",
        "implementation": "max-height transition or React state",
        "iconRotation": "180deg on open"
      },
      "testimonialSlider": {
        "description": "Card carousel",
        "library": "Swiper.js or react-slick",
        "config": {
          "autoplay": false,
          "loop": true,
          "slidesPerView": 1,
          "spaceBetween": 10
        }
      }
    },
    "svgAssets": {
      "logo": {
        "description": "40x40 AI logo with gradient",
        "gradient": "Linear from #F0E9F7 to #D588FC to #FF49D4",
        "filters": "Drop shadow + inner shadow",
        "background": "White or black rounded square"
      },
      "starIcon": {
        "description": "16x16 or 22x22 star for tags",
        "fill": "Gradient",
        "usage": "Primary tag variant"
      },
      "tickerIcon": {
        "description": "250x250 or 300x300 AI logo",
        "style": "3D effect with multiple layers",
        "complexity": "High (multiple gradients, filters)"
      },
      "accordionIcon": {
        "description": "16x16 chevron or plus/minus",
        "rotation": "0deg closed, 180deg open"
      }
    }
  },

  "contentMapping": {
    "hero": {
      "tag": "Transform Your Business with AI",
      "h1": "Empower Your Business With AI-Driven Intelligence",
      "description": "Fluence AI helps you integrate, analyze, and automate your data workflows. Make smarter decisions, boost productivity, and unlock the full potential of your business with our advanced AI-powered platform."
    },
    "features": [
      {
        "title": "Seamless Data Integration Process",
        "description": "Effortlessly connect with diverse data sources, ensuring smooth data flow for real-time insights and accurate analysis.",
        "items": [
          "Real-Time Data Syncing",
          "Multi-Platform Support",
          "Secure Data Transfer"
        ]
      },
      {
        "title": "AI-Powered Analytics",
        "description": "Leverage advanced AI algorithms to gain deeper insights from your data and make informed business decisions.",
        "items": [
          "Predictive Analytics",
          "Custom Dashboards",
          "Automated Reports"
        ]
      },
      {
        "title": "Workflow Automation",
        "description": "Automate repetitive tasks and streamline your business processes with intelligent automation tools.",
        "items": [
          "Task Automation",
          "Smart Notifications",
          "Process Optimization"
        ]
      }
    ],
    "howItWorks": [
      {
        "title": "Connect Your Data Sources",
        "description": "Link your existing tools and platforms to Fluence AI in just a few clicks. Our platform supports a wide range of integrations."
      },
      {
        "title": "Analyze and Gain Insights",
        "description": "Our AI-powered engine processes your data in real-time, providing actionable insights and predictive analytics."
      },
      {
        "title": "Automate and Optimize",
        "description": "Set up automated workflows to streamline your processes. Let AI handle the repetitive tasks while you focus on growth."
      }
    ],
    "stats": [
      {
        "number": "50+",
        "label": "Apps & services, and growing."
      },
      {
        "number": "1000+",
        "label": "Active users worldwide."
      },
      {
        "number": "99.9%",
        "label": "Uptime guaranteed."
      }
    ],
    "testimonials": [
      {
        "quote": "Fluence AI has revolutionized the way we process data. The seamless integration and advanced analytics tools have saved us countless hours and improved our decision-making.",
        "author": "Sarah J.",
        "role": "Data Analyst, TechCorp"
      },
      {
        "quote": "The automation features in Fluence AI have made our workflows so much more efficient. We're now able to focus on high-priority tasks while the system handles the rest.",
        "author": "Mark L.",
        "role": "Operations Manager, GrowthTech"
      },
      {
        "quote": "Thanks to Fluence AI, we now make data-driven decisions in real time. The predictive analytics have helped us forecast trends and stay ahead of the competition.",
        "author": "Emily R.",
        "role": "Marketing Director, InnovateCo"
      }
    ],
    "faq": [
      {
        "q": "What is Fluence AI?",
        "a": "Fluence AI is a powerful platform designed to help businesses integrate, analyze, and automate data workflows using artificial intelligence. It empowers teams to make smarter decisions and drive growth through seamless data management."
      },
      {
        "q": "Can I integrate Fluence AI with my existing tools?",
        "a": "Yes! Fluence AI supports integration with a wide range of tools and platforms. Our flexible APIs allow you to connect with your data sources effortlessly, enabling a smooth workflow."
      },
      {
        "q": "How does Fluence AI automate tasks?",
        "a": "Fluence AI uses AI-driven workflows to automate repetitive tasks such as data processing, reporting, and notifications. This helps save time and boosts productivity for your team."
      },
      {
        "q": "Is my data secure with Fluence AI?",
        "a": "Absolutely! Fluence AI takes security seriously. We use enterprise-grade encryption to protect your data, ensuring that it's secure at all stages, from integration to processing."
      },
      {
        "q": "What kind of support do you offer?",
        "a": "We offer 24/7 support via email for all users, with additional live chat and priority support for Plus and Pro plan subscribers. Our team is always ready to assist with any questions or issues you may have."
      }
    ]
  },

  "implementationTips": {
    "forClaudeCLI": [
      "Start with component library first - build all reusable components",
      "Use Tailwind classes that match Framer's design (spacing, colors, typography)",
      "Implement animations with Framer Motion for smooth transitions",
      "Use next/image for optimized image loading",
      "Create a design tokens file (colors, spacing, typography) for consistency",
      "Build mobile-first, then add tablet and desktop breakpoints",
      "Use CSS Grid and Flexbox to match Framer's stack/grid layouts",
      "Test hover states and animations on all interactive elements",
      "Implement lazy loading for images below the fold",
      "Add smooth scroll behavior for anchor links",
      "Use Intersection Observer for scroll animations",
      "Create reusable layout components (Container, Section, Grid)",
      "Implement proper TypeScript types for all components",
      "Add proper alt text and ARIA labels for accessibility",
      "Test responsive design at all breakpoints"
    ]
  },

  "finalNotes": {
    "missingFromTimeout": [
      "Page principale complète (home page augiA20Il) - trop volumineuse",
      "Page contact complète (G9kMkT9Mv) - timeout",
      "Quelques variantes de composants non-primaires"
    ],
    "whatWeHave": [
      "Structure complète de 5 pages (404, privacy, blog, blog-post, partiel home)",
      "35 composants documentés avec nodeIds et props",
      "Système de couleurs complet (13 couleurs + gradients)",
      "Système typographique complet (13 styles)",
      "Layout system avec breakpoints",
      "Animations détaillées",
      "URL d'export React",
      "Instructions de recréation complètes",
      "Content mapping pour textes",
      "XML structure pour la plupart des composants"
    ],
    "howToUseThisDoc": [
      "Utilisez ce JSON comme référence complète pour recréer le site",
      "Les nodeIds permettent de retrouver chaque élément dans Framer",
      "Les structures XML montrent exactement comment assembler les composants",
      "Les props documentées indiquent quelles valeurs peuvent être personnalisées",
      "Le recreationGuide donne l'ordre optimal d'implémentation",
      "Les svgAssets décrivent les icônes à créer ou trouver",
      "Le contentMapping fournit tous les textes du site"
    ]
  }
}