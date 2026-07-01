const fetch = require('node-fetch');
const Parser = require('rss-parser');
const rssParser = new Parser({ timeout: 8000 });

const AREA_QUERY_MAP = {
  // Andhra Pradesh
  vizag: 'Visakhapatnam', vijayawada: 'Vijayawada', guntur: 'Guntur',
  tirupati: 'Tirupati', kurnool: 'Kurnool', nellore: 'Nellore',
  rajahmundry: 'Rajahmundry', kakinada: 'Kakinada', eluru: 'Eluru',
  ongole: 'Ongole', kadapa: 'Kadapa', anantapur: 'Anantapur',
  srikakulam: 'Srikakulam', vizianagaram: 'Vizianagaram',
  // Telangana
  hyderabad: 'Hyderabad', hyderabad_hitech: 'HiTech City Hyderabad',
  hyderabad_secunderabad: 'Secunderabad Hyderabad',
  warangal: 'Warangal', karimnagar: 'Karimnagar', nizamabad: 'Nizamabad',
  khammam: 'Khammam', nalgonda: 'Nalgonda', adilabad: 'Adilabad',
  // Tamil Nadu
  chennai: 'Chennai', coimbatore: 'Coimbatore', madurai: 'Madurai',
  salem: 'Salem', trichy: 'Trichy', tirunelveli: 'Tirunelveli',
  vellore: 'Vellore', erode: 'Erode',
  // Karnataka
  bangalore: 'Bangalore', mysore: 'Mysore', mangalore: 'Mangalore',
  hubli: 'Hubli Dharwad', belgaum: 'Belagavi',
  // Kerala
  kochi: 'Kochi', thiruvananthapuram: 'Thiruvananthapuram',
  kozhikode: 'Kozhikode', thrissur: 'Thrissur', kollam: 'Kollam',
  // Maharashtra
  mumbai: 'Mumbai', pune: 'Pune', nagpur: 'Nagpur',
  nashik: 'Nashik', aurangabad: 'Aurangabad', solapur: 'Solapur',
  // Delhi/NCR
  delhi: 'New Delhi', noida: 'Noida', gurgaon: 'Gurgaon', faridabad: 'Faridabad',
  // West Bengal
  kolkata: 'Kolkata', siliguri: 'Siliguri',
  // Gujarat
  ahmedabad: 'Ahmedabad', surat: 'Surat', vadodara: 'Vadodara', rajkot: 'Rajkot',
  // Rajasthan
  jaipur: 'Jaipur', jodhpur: 'Jodhpur', udaipur: 'Udaipur', kota: 'Kota',
  // Punjab/Haryana
  chandigarh: 'Chandigarh', amritsar: 'Amritsar', ludhiana: 'Ludhiana',
  // Uttar Pradesh
  lucknow: 'Lucknow', kanpur: 'Kanpur', varanasi: 'Varanasi',
  agra: 'Agra', meerut: 'Meerut',
  // Bihar
  patna: 'Patna',
  // MP
  bhopal: 'Bhopal', indore: 'Indore',
  // National/International
  national: 'India', international: 'World',
};

// RSS feeds for newspapers
const NEWSPAPER_RSS = {
  // English
  times_of_india:   'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu:        'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:   'https://indianexpress.com/feed/',
  hindustan_times:  'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald:    'https://www.deccanherald.com/rss-feed/national.rss',
  bbc:              'http://feeds.bbci.co.uk/news/world/rss.xml',
  reuters:          'https://feeds.reuters.com/reuters/topNews',
  guardian:         'https://www.theguardian.com/world/rss',
  al_jazeera:       'https://www.aljazeera.com/xml/rss/all.xml',
  economic_times:   'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
  business_standard:'https://www.business-standard.com/rss/home_page_top_stories.rss',
  // Telugu
  eenadu:           'https://www.eenadu.net/rss/telugu-news.xml',
  sakshi:           'https://www.sakshi.com/rss/telugu-news.xml',
  andhrajyothy:     'https://www.andhrajyothy.com/rss/top-news.xml',
  namaste_telangana:'https://www.namasttelangana.com/rss/top-news.xml',
  telangana_today:  'https://telanganatoday.com/feed',
  vaartha:          'https://www.vaartha.com/feed',
  // Hindi
  dainik_jagran:    'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar:   'https://www.bhaskar.com/rss-feed/8491/',
  amar_ujala:       'https://www.amarujala.com/rss/breaking-news.xml',
  navbharat_times:  'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms',
  hindustan_hindi:  'https://www.livehindustan.com/rss/national.xml',
  rajasthan_patrika:'https://www.patrika.com/rss/national-news.xml',
  // Tamil
  daily_thanthi:    'https://www.dailythanthi.com/rss/home',
  dinamalar:        'https://www.dinamalar.com/rss/news.xml',
  dinamani:         'https://www.dinamani.com/rss/all-news.xml',
  // Kannada
  vijaya_karnataka: 'https://vijaykarnataka.com/rssfeedstopstories.cms',
  prajavani:        'https://www.prajavani.net/feed',
  // Malayalam
  malayala_manorama:'https://www.manoramaonline.com/rss/news.xml',
  mathrubhumi:      'https://www.mathrubhumi.com/rss/news.xml',
  deshabhimani:     'https://www.deshabhimani.com/rss',
  // Marathi
  lokmat:           'https://www.lokmat.com/rss.xml',
  maharashtra_times:'https://maharashtratimes.com/rssfeedstopstories.cms',
  sakal:            'https://www.sakal.com/rss/top-news.xml',
  // Bengali
  anandabazar:      'https://www.anandabazar.com/rss/latest-news.xml',
  sangbad_pratidin: 'https://www.sangbadpratidin.in/feed',
  // Gujarati
  gujarat_samachar: 'https://www.gujaratsamachar.com/rss',
  divya_bhaskar:    'https://www.divyabhaskar.co.in/rss-feed/8491/',
};

const NEWSPAPER_NAME_MAP = {
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', bbc: 'BBC News', reuters: 'Reuters',
  guardian: 'The Guardian', al_jazeera: 'Al Jazeera', cnn: 'CNN',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan Hindi',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta',
  daily_thanthi: 'Dina Thanthi', dinamalar: 'Dinamalar',
  dinamani: 'Dinamani', maalai_malar: 'Maalai Malar',
  vijaya_karnataka: 'Vijaya Karnataka', prajavani: 'Prajavani',
  vijayavani: 'Vijayavani', udayavani: 'Udayavani',
  malayala_manorama: 'Malayala Manorama', mathrubhumi: 'Mathrubhumi',
  deshabhimani: 'Deshabhimani',
  lokmat: 'Lokmat', maharashtra_times: 'Maharashtra Times',
  pudhari: 'Pudhari', sakal: 'Sakal',
  anandabazar: 'Anandabazar Patrika', bartaman: 'Bartaman Patrika',
  sangbad_pratidin: 'Sangbad Pratidin', telegraph_india: 'The Telegraph India',
  gujarat_samachar: 'Gujarat Samachar', divya_bhaskar: 'Divya Bhaskar',
  sandesh: 'Sandesh',
};

// NewsAPI language codes
const LANG_API_MAP = {
  en: 'en', hi: 'hi', te: 'te', ta: 'ta',
  kn: 'kn', ml: 'ml', mr: 'mr', bn: 'bn',
};

async function fetchFromNewsAPI({ query, language = 'en', fromDate } = {}) {
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: process.env.NEWS_API_KEY,
    });

    // NewsAPI only supports en, ar, de, es, fr, he, it, nl, no, pt, ru, sv, ud, zh
    // For Indian languages fall back to English search with area/keyword
    const supportedLangs = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'zh'];
    if (supportedLangs.includes(language)) params.set('language', language);

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
      urlToImage: item.enclosure?.url || item['media:content']?.['$']?.url || null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || newspaper },
    }));
  } catch {
    return [];
  }
}

async function fetchByNewspaper(newspaper, area, language, fromDate) {
  // Try RSS first
  const rssArticles = await fetchFromRSS(newspaper);
  if (rssArticles.length > 0) return rssArticles;

  // Fall back to NewsAPI with newspaper name only (avoid mixing wrong sources)
  const paperName = NEWSPAPER_NAME_MAP[newspaper] || newspaper.replace(/_/g, ' ');
  const results = await fetchFromNewsAPI({ query: `"${paperName}"`, language: 'en', fromDate });
  return results.map(a => ({ ...a, source: { name: paperName } }));
}

async function fetchByAreaAndLanguage(area, language, keywords, fromDate) {
  const areaName = AREA_QUERY_MAP[area] || 'India';

  // Build smart query: keywords + area
  let query;
  if (keywords && keywords.length > 0) {
    query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;
  } else {
    query = areaName;
  }

  return fetchFromNewsAPI({ query, language, fromDate });
}

async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;
  return fetchFromNewsAPI({ query, language });
}

module.exports = {
  fetchFromNewsAPI,
  fetchFromRSS,
  fetchByNewspaper,
  fetchByAreaAndLanguage,
  fetchRecommendations,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
};
