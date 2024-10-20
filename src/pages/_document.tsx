import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Character encoding for proper text rendering */}
        <meta charSet="UTF-8" />

        {/* Search engine and social media instructions */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Locale of the page */}
        <meta property="og:locale" content="en_US" />

        {/* Author of the page */}
        <meta name="author" content="Oleanji" />

        {/* Open Graph metadata for social sharing */}
        <meta property="og:site_name" content="Fortune Cookie For Devs" />
        <meta
          property="og:title"
          content="Fortune Cookie For Devs - Unlock Your Fortune"
        />
        <meta
          property="og:description"
          content="Crack open a mystical fortune tailored for GitHub devs, with a sprinkle of roast and seer wisdom!"
        />

        {/* Image shown in social media previews (Replace with your hosted image URL) */}
        <meta
          property="og:image"
          content="https://yourdomain.com/path-to-cookie-image.jpg"
        />
        <meta property="og:image:width" content="920" />
        <meta property="og:image:height" content="470" />

        {/* Twitter-specific metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Fortune Cookie For Devs - Unlock Your Fortune"
        />
        <meta
          name="twitter:description"
          content="A playful roast or mystical wisdom awaits you! Click the cookie to reveal your developer fortune."
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/path-to-cookie-image.jpg"
        />

        {/* SEO keywords */}
        <meta
          name="keywords"
          content="fortune cookie, developers, GitHub, mystical fortunes, developer roast, playful seer"
        />

        {/* Page title */}
        <title>Fortune Cookie For Devs - Mystical Wisdom & Fun</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
