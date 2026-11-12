// Metadata for the 5 Leagues and 35 Elite Clubs (Season 2025-26)

export const LEAGUES_DATA = [
  {
    id: 'premier-league',
    name: 'Premier League',
    nameFa: 'لیگ برتر انگلیس',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#3D195B',
    accentColor: '#00FF87',
    glow: 'rgba(0, 255, 135, 0.4)',
    teamCount: 7,
    playerCount: 91,
    teams: ['Arsenal', 'Man City', 'Liverpool', 'Chelsea', 'Man United', 'Tottenham', 'Newcastle']
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    nameFa: 'لا لیگا اسپانیا',
    country: 'Spain',
    flag: '🇪🇸',
    color: '#EE1222',
    accentColor: '#FF8200',
    glow: 'rgba(255, 130, 0, 0.4)',
    teamCount: 7,
    playerCount: 91,
    teams: ['Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 'Villarreal', 'Real Sociedad', 'Real Betis']
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    nameFa: 'سری آ ایتالیا',
    country: 'Italy',
    flag: '🇮🇹',
    color: '#024494',
    accentColor: '#008FD7',
    glow: 'rgba(0, 143, 215, 0.4)',
    teamCount: 7,
    playerCount: 91,
    teams: ['Inter', 'Milan', 'Juventus', 'Napoli', 'Roma', 'Atalanta', 'Lazio']
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    nameFa: 'بوندس‌لیگا آلمان',
    country: 'Germany',
    flag: '🇩🇪',
    color: '#D20515',
    accentColor: '#FFFFFF',
    glow: 'rgba(210, 5, 21, 0.4)',
    teamCount: 7,
    playerCount: 91,
    teams: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'VfB Stuttgart', 'Eintracht Frankfurt', 'VfL Wolfsburg']
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    nameFa: 'لوشامپیونه فرانسه',
    country: 'France',
    flag: '🇫🇷',
    color: '#091C3E',
    accentColor: '#17D3C2',
    glow: 'rgba(23, 211, 194, 0.4)',
    teamCount: 7,
    playerCount: 91,
    teams: ['PSG', 'Marseille', 'Monaco', 'Lille', 'Lyon', 'Nice', 'Lens']
  }
];

export const TEAMS_DATA = {
  // ─── Premier League ──────────────────────────────────────
  'Arsenal': {
    league: 'Premier League',
    primaryColor: '#EF0107',
    secondaryColor: '#FFFFFF',
    accentColor: '#9C824A',
    monogram: 'AFC',
    symbol: '⚡',
    stadium: 'Emirates Stadium'
  },
  'Man City': {
    league: 'Premier League',
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    accentColor: '#FFFFFF',
    monogram: 'MCI',
    symbol: '⛵',
    stadium: 'Etihad Stadium'
  },
  'Liverpool': {
    league: 'Premier League',
    primaryColor: '#C8102E',
    secondaryColor: '#00B2A9',
    accentColor: '#F6EB61',
    monogram: 'LFC',
    symbol: '🦅',
    stadium: 'Anfield'
  },
  'Chelsea': {
    league: 'Premier League',
    primaryColor: '#034694',
    secondaryColor: '#FFFFFF',
    accentColor: '#DBA111',
    monogram: 'CFC',
    symbol: '🦁',
    stadium: 'Stamford Bridge'
  },
  'Man United': {
    league: 'Premier League',
    primaryColor: '#DA291C',
    secondaryColor: '#FBE122',
    accentColor: '#000000',
    monogram: 'MUFC',
    symbol: '👹',
    stadium: 'Old Trafford'
  },
  'Tottenham': {
    league: 'Premier League',
    primaryColor: '#132257',
    secondaryColor: '#FFFFFF',
    accentColor: '#00FF87',
    monogram: 'THFC',
    symbol: '🐓',
    stadium: 'Tottenham Hotspur Stadium'
  },
  'Newcastle': {
    league: 'Premier League',
    primaryColor: '#241F20',
    secondaryColor: '#FFFFFF',
    accentColor: '#41B6E6',
    monogram: 'NUFC',
    symbol: '🏰',
    stadium: "St James' Park"
  },

  // ─── La Liga ─────────────────────────────────────────────
  'Real Madrid': {
    league: 'La Liga',
    primaryColor: '#00529F',
    secondaryColor: '#FEBE10',
    accentColor: '#FFFFFF',
    monogram: 'RMCF',
    symbol: '👑',
    stadium: 'Santiago Bernabéu'
  },
  'Barcelona': {
    league: 'La Liga',
    primaryColor: '#004D98',
    secondaryColor: '#A50044',
    accentColor: '#EDBB00',
    monogram: 'FCB',
    symbol: '🛡️',
    stadium: 'Camp Nou'
  },
  'Atlético Madrid': {
    league: 'La Liga',
    primaryColor: '#CB3524',
    secondaryColor: '#272E61',
    accentColor: '#FFFFFF',
    monogram: 'ATM',
    symbol: '🐻',
    stadium: 'Metropolitano'
  },
  'Sevilla': {
    league: 'La Liga',
    primaryColor: '#D40F1C',
    secondaryColor: '#FFFFFF',
    accentColor: '#CBB26B',
    monogram: 'SFC',
    symbol: '⚔️',
    stadium: 'Ramón Sánchez-Pizjuán'
  },
  'Villarreal': {
    league: 'La Liga',
    primaryColor: '#FFE600',
    secondaryColor: '#00519E',
    accentColor: '#DA291C',
    monogram: 'VCF',
    symbol: '🚢',
    stadium: 'Estadio de la Cerámica'
  },
  'Real Sociedad': {
    league: 'La Liga',
    primaryColor: '#0067B1',
    secondaryColor: '#FFFFFF',
    accentColor: '#CBB26B',
    monogram: 'RSO',
    symbol: '👑',
    stadium: 'Reale Arena'
  },
  'Real Betis': {
    league: 'La Liga',
    primaryColor: '#009540',
    secondaryColor: '#FFFFFF',
    accentColor: '#CBB26B',
    monogram: 'RBB',
    symbol: '🌴',
    stadium: 'Benito Villamarín'
  },

  // ─── Serie A ─────────────────────────────────────────────
  'Inter': {
    league: 'Serie A',
    primaryColor: '#001489',
    secondaryColor: '#000000',
    accentColor: '#D4AF37',
    monogram: 'IM',
    symbol: '🐍',
    stadium: 'San Siro'
  },
  'Milan': {
    league: 'Serie A',
    primaryColor: '#FB090B',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    monogram: 'ACM',
    symbol: '😈',
    stadium: 'San Siro'
  },
  'Juventus': {
    league: 'Serie A',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    accentColor: '#D4AF37',
    monogram: 'JUVE',
    symbol: '🦓',
    stadium: 'Allianz Stadium'
  },
  'Napoli': {
    league: 'Serie A',
    primaryColor: '#12A0D7',
    secondaryColor: '#FFFFFF',
    accentColor: '#002B49',
    monogram: 'SSC',
    symbol: '🌋',
    stadium: 'Diego Armando Maradona'
  },
  'Roma': {
    league: 'Serie A',
    primaryColor: '#8E1F2F',
    secondaryColor: '#F0BC42',
    accentColor: '#FFFFFF',
    monogram: 'ASR',
    symbol: '🐺',
    stadium: 'Stadio Olimpico'
  },
  'Atalanta': {
    league: 'Serie A',
    primaryColor: '#1E51A4',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    monogram: 'ATA',
    symbol: '🏃‍♀️',
    stadium: 'Gewiss Stadium'
  },
  'Lazio': {
    league: 'Serie A',
    primaryColor: '#87D8F7',
    secondaryColor: '#FFFFFF',
    accentColor: '#002B49',
    monogram: 'SSL',
    symbol: '🦅',
    stadium: 'Stadio Olimpico'
  },

  // ─── Bundesliga ──────────────────────────────────────────
  'Bayern Munich': {
    league: 'Bundesliga',
    primaryColor: '#DC052D',
    secondaryColor: '#0066B2',
    accentColor: '#FFFFFF',
    monogram: 'FCB',
    symbol: '⭐',
    stadium: 'Allianz Arena'
  },
  'Borussia Dortmund': {
    league: 'Bundesliga',
    primaryColor: '#FDE100',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    monogram: 'BVB',
    symbol: '🐝',
    stadium: 'Signal Iduna Park'
  },
  'Bayer Leverkusen': {
    league: 'Bundesliga',
    primaryColor: '#E32221',
    secondaryColor: '#000000',
    accentColor: '#FFCC00',
    monogram: 'B04',
    symbol: '🦁',
    stadium: 'BayArena'
  },
  'RB Leipzig': {
    league: 'Bundesliga',
    primaryColor: '#DD0741',
    secondaryColor: '#0C2340',
    accentColor: '#F5A623',
    monogram: 'RBL',
    symbol: '🐂',
    stadium: 'Red Bull Arena'
  },
  'VfB Stuttgart': {
    league: 'Bundesliga',
    primaryColor: '#E32219',
    secondaryColor: '#FFFFFF',
    accentColor: '#FDE100',
    monogram: 'VFB',
    symbol: '🦌',
    stadium: 'MHPArena'
  },
  'Eintracht Frankfurt': {
    league: 'Bundesliga',
    primaryColor: '#E1000F',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    monogram: 'SGE',
    symbol: '🦅',
    stadium: 'Deutsche Bank Park'
  },
  'VfL Wolfsburg': {
    league: 'Bundesliga',
    primaryColor: '#65B32E',
    secondaryColor: '#FFFFFF',
    accentColor: '#005CA9',
    monogram: 'WOB',
    symbol: '🐺',
    stadium: 'Volkswagen Arena'
  },

  // ─── Ligue 1 ─────────────────────────────────────────────
  'PSG': {
    league: 'Ligue 1',
    primaryColor: '#004170',
    secondaryColor: '#DA291C',
    accentColor: '#D4AF37',
    monogram: 'PSG',
    symbol: '🗼',
    stadium: 'Parc des Princes'
  },
  'Marseille': {
    league: 'Ligue 1',
    primaryColor: '#2FAEE0',
    secondaryColor: '#FFFFFF',
    accentColor: '#D4AF37',
    monogram: 'OM',
    symbol: '⭐',
    stadium: 'Orange Vélodrome'
  },
  'Monaco': {
    league: 'Ligue 1',
    primaryColor: '#ED1C24',
    secondaryColor: '#FFFFFF',
    accentColor: '#D4AF37',
    monogram: 'ASM',
    symbol: '👑',
    stadium: 'Stade Louis II'
  },
  'Lille': {
    league: 'Ligue 1',
    primaryColor: '#E01E26',
    secondaryColor: '#162141',
    accentColor: '#FFFFFF',
    monogram: 'LOSC',
    symbol: '🐶',
    stadium: 'Decathlon Arena'
  },
  'Lyon': {
    league: 'Ligue 1',
    primaryColor: '#1A3275',
    secondaryColor: '#DA291C',
    accentColor: '#D4AF37',
    monogram: 'OL',
    symbol: '🦁',
    stadium: 'Groupama Stadium'
  },
  'Nice': {
    league: 'Ligue 1',
    primaryColor: '#DA291C',
    secondaryColor: '#000000',
    accentColor: '#D4AF37',
    monogram: 'OGCN',
    symbol: '🦅',
    stadium: 'Allianz Riviera'
  },
  'Lens': {
    league: 'Ligue 1',
    primaryColor: '#EC1C24',
    secondaryColor: '#FFF200',
    accentColor: '#000000',
    monogram: 'RCL',
    symbol: '⛏️',
    stadium: 'Stade Bollaert-Delelis'
  }
};

export const NATIONALITY_FLAGS = {
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Italy': '🇮🇹',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱',
  'Norway': '🇳🇴',
  'Belgium': '🇧🇪',
  'Croatia': '🇭🇷',
  'Uruguay': '🇺🇾',
  'Poland': '🇵🇱',
  'Colombia': '🇨🇴',
  'Senegal': '🇸🇳',
  'Nigeria': '🇳🇬',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Sweden': '🇸🇪',
  'Denmark': '🇩🇰',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Egypt': '🇪🇬',
  'Morocco': '🇲🇦',
  'Algeria': '🇩🇿',
  'Cameroon': '🇨🇲',
  'Ghana': '🇬🇭',
  'Ivory Coast': '🇨🇮',
  'Mali': '🇲🇱',
  'Slovenia': '🇸🇮',
  'Serbia': '🇷🇸',
  'Turkey': '🇹🇷',
  'Ukraine': '🇺🇦',
  'Georgia': '🇬🇪',
  'Hungary': '🇭🇺',
  'Canada': '🇨🇦',
  'USA': '🇺🇸',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Czech Republic': '🇨🇿',
  'Slovakia': '🇸🇰',
  'Kosovo': '🇽🇰',
  'Guinea': '🇬🇳',
  'Finland': '🇫🇮',
  'Burkina Faso': '🇧🇫',
  'Bosnia': '🇧🇦',
  'Ecuador': '🇪🇨',
  'Armenia': '🇦🇲',
  'Mozambique': '🇲🇿',
  'Venezuela': '🇻🇪',
  'Suriname': '🇸🇷',
  'Iceland': '🇮🇸',
  'Russia': '🇷🇺',
  'Tunisia': '🇹🇳',
  'Panama': '🇵🇦',
  'Central African Republic': '🇨🇫',
  'Burundi': '🇧🇮',
  'Angola': '🇦🇴',
  'Iran': '🇮🇷',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
};
