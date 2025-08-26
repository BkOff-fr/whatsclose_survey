import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  const robotsTxt = `# WhatsClose Robots.txt
# https://www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemap
Sitemap: ${protocol}://${host}/sitemap.xml

# Crawl-delay (in seconds)
Crawl-delay: 1

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow social media bots
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Slackbot
Allow: /
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}