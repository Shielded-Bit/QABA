import "./globals.css";
import ClientLayout from "./ClientLayout";
import StructuredData, { organizationStructuredData, websiteStructuredData } from "../components/seo/StructuredData";

// Global metadata for the entire site
export const metadata = {
  title: {
    template: '%s | QARBA',
    default: 'QARBA - Leading Real Estate Platform | Buy, Sell & Rent Properties'
  },
  description: 'QARBA - Nigeria\'s #1 property platform. Find properties for sale and rent in Lagos, Abuja, Port Harcourt. Buy, sell, rent houses, apartments, commercial properties. Real estate made simple with QARBA.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  keywords: [
    // Primary QARBA keywords
    'qarba',
    'qarba properties',
    'qarba real estate',
    'qarba nigeria',
    'qarba platform',
    'qarba properties for sale',
    'qarba properties for rent',
    'qarba houses',
    'qarba apartments',
    
    // High-volume property keywords
    'properties',
    'properties for sale',
    'properties for rent',
    'property',
    'property for sale',
    'property for rent',
    'real estate',
    'real estate nigeria',
    'real estate platform',
    'property platform',
    'property marketplace',
    'property listings',
    'property search',
    'find properties',
    'buy property',
    'sell property',
    'rent property',
    'property investment',
    
    // Geographic keywords
    'properties lagos',
    'properties abuja',
    'properties port harcourt',
    'properties kano',
    'properties ibadan',
    'properties calabar',
    'properties enugu',
    'properties benin',
    'properties jos',
    'properties kaduna',
    'properties nigeria',
    'nigerian properties',
    'lagos properties',
    'abuja properties',
    'port harcourt properties',
    
    // Property type keywords
    'houses for sale',
    'houses for rent',
    'apartments for sale',
    'apartments for rent',
    'commercial properties',
    'residential properties',
    'luxury homes',
    'affordable housing',
    'duplex for sale',
    'bungalow for sale',
    'flat for rent',
    'land for sale',
    'office space',
    'shop for rent',
    'warehouse for rent',
    
    // Search intent keywords
    'find house',
    'find apartment',
    'house hunting',
    'property search nigeria',
    'best property website',
    'top real estate site',
    'property portal',
    'real estate website',
    'property finder',
    'house finder',
    'apartment finder',
    'property agent',
    'real estate agent',
    'property developer',
    'property management'
  ].join(', '),
  authors: [{ name: 'QARBA Team' }],
  creator: 'QARBA',
  publisher: 'QARBA',
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://qarba.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    siteName: 'QARBA',
    title: 'QARBA - Leading Real Estate Platform | Buy, Sell & Rent Properties',
    description: 'QARBA - Find Properties for Sale & Rent in Nigeria. Browse houses, apartments, commercial properties in Lagos, Abuja, Port Harcourt. Nigeria\'s #1 property platform with verified listings.',
    locale: 'en_US',
    url: '/',
    images: [
      {
        url: '/qarbaLogo.png',
        width: 1200,
        height: 630,
        alt: 'QARBA - Leading Real Estate Platform | Property Marketplace',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@qarba',
    creator: '@qarba',
    title: 'QARBA - Leading Real Estate Platform | Buy, Sell & Rent Properties',
    description: 'QARBA - Find Properties for Sale & Rent in Nigeria. Browse houses, apartments, commercial properties in Lagos, Abuja, Port Harcourt. Nigeria\'s #1 property platform.',
    images: [
      {
        url: '/qarbaLogo.png',
        alt: 'QARBA - Leading Real Estate Platform | Property Marketplace'
      }
    ]
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/qarbaLogo.png', sizes: '16x16 32x32', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '16x16', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '96x96', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '128x128', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/qarbaLogo.png',
    apple: [
      { url: '/qarbaLogo.png', sizes: '128x128', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '144x144', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '152x152', type: 'image/png' },
      { url: '/qarbaLogo.png', sizes: '192x192', type: 'image/png' }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QARBA'
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#014d98'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/png" href="/qarbaLogo.png" sizes="16x16 32x32" />
        <link rel="icon" type="image/png" sizes="16x16" href="/qarbaLogo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/qarbaLogo.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/qarbaLogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/qarbaLogo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/qarbaLogo.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/qarbaLogo.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/qarbaLogo.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#014d98" />
        <meta name="theme-color" content="#014d98" />
        
        {/* Enhanced SEO Meta Tags */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="bing-site-verification" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        {/* Geographic and Language Meta Tags */}
        <meta name="geo.region" content="NG" />
        <meta name="geo.country" content="Nigeria" />
        <meta name="geo.placename" content="Lagos, Abuja, Port Harcourt" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        
        {/* Property and Real Estate Specific Meta Tags */}
        <meta name="classification" content="Real Estate, Property, Housing, Commercial Real Estate" />
        <meta name="category" content="Real Estate Platform" />
        <meta name="coverage" content="Nigeria" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Mobile and App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QARBA" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://qarba.com/" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Structured Data */}
        <StructuredData data={organizationStructuredData} />
        <StructuredData data={websiteStructuredData} />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
