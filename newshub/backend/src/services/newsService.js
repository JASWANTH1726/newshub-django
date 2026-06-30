const fetch = require('node-fetch');
const Parser = require('rss-parser');
const rssParser = new Parser({ timeout: 8000 });

const AREA_QUERY_MAP = {
  vizag: 'Visakhapatnam', vizag_gajuwaka: 'Gajuwaka Visakhapatnam',
  vizag_mvp: 'MVP Colony Visakhapatnam', vijayawada: 'Vijayawada',
  guntur: 'Guntur', tirupati: 'Tirupati', kurnool: 'Kurnool',
  nellore: 'Nellore', rajahmundry: 'Rajahmundry', kakinada: 'Kakinada',
  hyderabad: 'Hyderabad', hyderabad_hitech: 'HiTech City Hyderabad',
  warangal: 'Warangal', karimnagar: 'Karimnagar', nizamabad: 'Nizamabad',
  chennai: 'Chennai', coimbatore: 'Coimbatore', madurai: 'Madurai',
  bangalore: 'Bangalore', mysore: 'Mysore', mangalore: 'Mangalore',
  kochi: 'Kochi', thiruvananthapuram: 'Thiruvananthapuram',
  mumbai: 'Mumbai', pune: 'Pune', nagpur: 'Nagpur',
  delhi: 'New Delhi', noida: 'Noida', gurgaon: 'Gurgaon',
  kolkata: 'Kolkata', ahmedabad: 'Ahmedabad', surat: 'Surat',
  jaipur: 'Jaipur', lucknow: 'Lucknow', patna: 'Patna',
  bhopal: 'Bhopal', indore: 'Indore', chandigarh: 'Chandigarh',
  national: 'India', international: 'World',
};

const NEWSPAPER_RSS = {
  times_of_india:   'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu:        'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:   'https://indianexpress.com/feed/',
  hindustan_times:  'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald:    'https://www.deccanherald.com/rss-feed/national.rss',
  bbc:              'http://feeds.bbci.co.uk/news/world/rss.xml',
  reuters:          'https://feeds.reuters.com/reuters/topNews',
  guardian:         'https://www.theguardian.com/world/rss',
  al_jazeera:       'https://www.aljazeera.com/xml/rss/all.xml',
  eenadu:           'https://www.eenadu.net/rss/telugu-news.xml',
  sakshi:           'https://www.sakshi.com/rss/news',
  dainik_jagran:    'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar:   'https://www.bhaskar.com/rss-feed/8491/',
  malayala_manorama:'https://www.manoramaonline.com/rss/news.xml',
  lokmat:           'https://www.lokmat.com/rss.xml',
  anandabazar:      'https://www.anandabazar.com/rss',
  gujarat_samachar: 'https://www.gujaratsamachar.com/rss',
};

const NEWSPAPER_NAME_MAP = {
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', bbc: 'BBC News', reuters: 'Reuters',
  guardian: 'The Guardian', new_york_times: 'New York Times',
  al_jazeera: 'Al Jazeera', cnn: 'CNN', eenadu: 'Eenadu', sakshi: 'Sakshi',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  malayala_manorama: 'Malayala Manorama', lokmat: 'Lokmat',
  anandabazar: 'Anandabazar Patrika',
};

async function fetchFromNewsAPI({ query, language = 'en', fromDate } = {}) {
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      language,
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: process.env.NEWS_API_KEY,
    });
    if (fromDate) params.set('from', fromDate);

    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).filter(a => a.title && a.title !== '[Removed]');
  } catch {
    return [];
  }
}

async function fetchFromRSS(newspaper) {
  const url = NEWSPAPER_RSS[newspaper];
  if (!url) return [];
  try {
    const feed = await rssParser.parseURL(url);
    return feed.items.slice(0, 20).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: item.enclosure?.url || null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || newspaper },
    }));
  } catch {
    return [];
  }
}

async function fetchByNewspaper(newspaper, area, language, fromDate) {
  // Try RSS first, fall back to NewsAPI
  const rssArticles = await fetchFromRSS(newspaper);
  if (rssArticles.length > 0) return rssArticles;

  const paperName = NEWSPAPER_NAME_MAP[newspaper] || newspaper;
  const areaName = AREA_QUERY_MAP[area] || 'India';
  return fetchFromNewsAPI({ query: `${paperName} ${areaName}`, language, fromDate });
}

async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = keywords.slice(0, 3).join(' OR ') + ` ${areaName}`;
  return fetchFromNewsAPI({ query, language });
}

module.exports = {
  fetchFromNewsAPI,
  fetchByNewspaper,
  fetchRecommendations,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
};
