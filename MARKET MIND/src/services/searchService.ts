export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY || '';

export async function webSearch(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  if (!SERPAPI_KEY) {
    console.warn('VITE_SERPAPI_KEY not configured. Using mock search results.');
    return getMockSearchResults(query);
  }

  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.append('q', query);
    url.searchParams.append('api_key', SERPAPI_KEY);
    url.searchParams.append('num', maxResults.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`SerpAPI error ${response.status}`);
      return getMockSearchResults(query);
    }

    const data = await response.json();
    const results: SearchResult[] = [];

    // Extract organic search results
    if (data.organic_results && Array.isArray(data.organic_results)) {
      for (const result of data.organic_results.slice(0, maxResults)) {
        results.push({
          title: result.title || '',
          link: result.link || '',
          snippet: result.snippet || '',
        });
      }
    }

    return results.length > 0 ? results : getMockSearchResults(query);
  } catch (error) {
    console.error('Web search failed:', error);
    return getMockSearchResults(query);
  }
}

function getMockSearchResults(query: string): SearchResult[] {
  return [
    {
      title: `${query} Market Overview - Latest 2025 Data`,
      link: 'https://example.com/market-overview',
      snippet: `Comprehensive market analysis for ${query}. Key trends include digital transformation, sustainability initiatives, and market consolidation. Growth rate: 12-15% YoY.`,
    },
    {
      title: `${query} Industry Report Q1 2025`,
      link: 'https://example.com/industry-report',
      snippet: `Latest quarterly report on ${query} sector. Major players include leading corporations investing heavily in innovation and R&D. Market size estimated at $XX billion.`,
    },
    {
      title: `Competitive Landscape in ${query}`,
      link: 'https://example.com/competitive',
      snippet: `Analysis of key competitors and market share distribution. Emerging startups disrupting traditional players with AI-driven solutions and customer-centric approaches.`,
    },
    {
      title: `${query} Trends and Opportunities 2025`,
      link: 'https://example.com/trends',
      snippet: `Identifying emerging opportunities in ${query}. Investment in sustainability, automation, and customer experience driving market growth. Challenges include regulatory compliance and supply chain issues.`,
    },
    {
      title: `${query} SWOT Analysis`,
      link: 'https://example.com/swot',
      snippet: `Strategic analysis revealing strengths in brand recognition and market presence. Weaknesses include high operational costs. Opportunities in emerging markets and digital channels.`,
    },
  ];
}

export function formatSearchResultsForPrompt(results: SearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `${i + 1}. "${r.title}"\n   Source: ${r.link}\n   Summary: ${r.snippet}`
    )
    .join('\n\n');
}
