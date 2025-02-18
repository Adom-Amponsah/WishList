import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords,
  image = 'https://nokonice.com/images/Logo_Purple.png',
  url,
  type = 'website'
}) {
  const siteName = 'Nokonice - Create & Share Wishlists';
  const formattedTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Create and share your wishlist with friends. Get the gifts you actually want—create a wishlist, share it, and let others buy them for you!';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/images/Logo_Purple.png" />
      <link rel="apple-touch-icon" href="/images/Logo_Purple.png" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Nokonice Logo" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#970058" />
      {url && <link rel="canonical" href={url} />}

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "${siteName}",
            "url": "${url || 'https://nokonice.com'}",
            "description": "${description || defaultDescription}",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "${url || 'https://nokonice.com'}/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
    </Helmet>
  );
} 