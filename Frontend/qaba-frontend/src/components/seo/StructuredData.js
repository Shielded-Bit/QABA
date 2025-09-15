// Structured Data for Real Estate SEO

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "QARBA",
  "description": "Nigeria's leading real estate platform for buying, selling, and renting properties",
  "url": "https://qarba.com",
  "logo": "https://qarba.com/qarbaLogo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "10 Brackenbury Street",
    "addressLocality": "Abakaliki",
    "addressRegion": "Ebonyi State",
    "addressCountry": "Nigeria"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+234-707-664-7640",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    {
      "@type": "ContactPoint",
      "email": "contact@qarba.com",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    }
  ],
  "openingHours": "Mo-Fr 09:00-18:00",
  "sameAs": [
    "https://facebook.com/qarba",
    "https://twitter.com/qarba",
    "https://instagram.com/qarba",
    "https://linkedin.com/company/qarba"
  ],
  "serviceArea": {
    "@type": "Country",
    "name": "Nigeria"
  },
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Property Sales",
        "description": "Buy and sell residential and commercial properties"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Property Rentals",
        "description": "Rent apartments, houses, and commercial spaces"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Property Management",
        "description": "Professional property management services"
      }
    }
  ]
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "QARBA",
  "url": "https://qarba.com",
  "description": "Nigeria's leading real estate platform for buying, selling, and renting properties",
  "publisher": {
    "@type": "Organization",
    "name": "QARBA",
    "logo": {
      "@type": "ImageObject",
      "url": "https://qarba.com/qarbaLogo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://qarba.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbStructuredData = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const propertyStructuredData = (property) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": property.title,
  "description": property.description,
  "url": property.url,
  "image": property.images,
  "price": {
    "@type": "MonetaryAmount",
    "value": property.price,
    "currency": "NGN"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": property.address,
    "addressLocality": property.city,
    "addressRegion": property.state,
    "addressCountry": "Nigeria"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": property.latitude,
    "longitude": property.longitude
  },
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": property.size,
    "unitText": "SQM"
  },
  "numberOfRooms": property.bedrooms,
  "numberOfBathroomsTotal": property.bathrooms,
  "yearBuilt": property.yearBuilt,
  "propertyType": property.type,
  "availableFrom": property.availableFrom,
  "offers": {
    "@type": "Offer",
    "price": property.price,
    "priceCurrency": "NGN",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "RealEstateAgent",
      "name": "QARBA"
    }
  }
});

const StructuredData = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
};

export default StructuredData;