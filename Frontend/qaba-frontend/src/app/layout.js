import "./globals.css";
import ClientLayout from "./ClientLayout";
import StructuredData, { organizationStructuredData, websiteStructuredData } from "../components/seo/StructuredData";

// Global metadata for the entire site
export const metadata = {
  title: {
    template: '%s | QARBA',
    default: 'QARBA - Leading Real Estate Platform | Buy, Sell & Rent Properties'
  },
  description: 'QARBA is the leading real estate platform connecting buyers, sellers, and renters. Find your perfect property, list your home, or discover investment opportunities on Nigeria\'s premier real estate marketplace.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  keywords: [
    // Main competitive keywords
    'leading real estate platform',
    'top property marketplace',
    'premier real estate website',
    'best property platform',
    'top real estate marketplace',
    'leading property portal',
    'premier property website',
    'top real estate portal',
    'largest property marketplace',
    'leading property platform',
    
    // Geographic keywords
    'real estate Nigeria',
    'property Nigeria',
    'real estate Lagos',
    'property Lagos',
    'real estate Abuja',
    'property Abuja',
    'real estate Port Harcourt',
    'property Port Harcourt',
    'real estate Kano',
    'property Kano',
    'Nigerian properties',
    'Nigeria real estate market',
    
    // Property type keywords
    'houses for sale',
    'apartments for rent',
    'commercial properties',
    'residential properties',
    'luxury homes',
    'affordable housing',
    'property investment',
    'real estate investment',
    'buy property',
    'sell property',
    'rent property',
    'property listings',
    'real estate agents',
    'property developers',
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
    description: 'Discover your dream property on QARBA, Nigeria\'s leading real estate platform. Browse thousands of listings, connect with verified agents, and find the perfect home or investment opportunity.',
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
    description: 'Discover your dream property on QARBA, Nigeria\'s leading real estate platform. Browse thousands of listings, connect with verified agents, and find the perfect home.',
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
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#014d98" />
        <meta name="theme-color" content="#014d98" />
        
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
