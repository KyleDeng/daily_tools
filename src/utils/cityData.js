/**
 * Chinese cities with QWeather Location IDs
 * Data source: QWeather API
 */

// Frequently used cities (hot cities)
export const HOT_CITIES = [
  { name: '杭州', id: '101210101', pinyin: 'hangzhou' },
  { name: '天津', id: '101030100', pinyin: 'tianjin' },
  { name: '任丘', id: '101090714', pinyin: 'renqiu' },
  { name: '深圳', id: '101280601', pinyin: 'shenzhen' },
  { name: '宁波', id: '101210401', pinyin: 'ningbo' },
];

// All supported cities (provincial capitals + major cities)
export const ALL_CITIES = [
  // Hot cities (duplicated for easier management)
  ...HOT_CITIES,
  
  // Provincial capitals and major cities
  { name: '北京', id: '101010100', pinyin: 'beijing' },
  { name: '上海', id: '101020100', pinyin: 'shanghai' },
  { name: '广州', id: '101280101', pinyin: 'guangzhou' },
  { name: '成都', id: '101270101', pinyin: 'chengdu' },
  { name: '重庆', id: '101040100', pinyin: 'chongqing' },
  { name: '武汉', id: '101200101', pinyin: 'wuhan' },
  { name: '西安', id: '101110101', pinyin: 'xian' },
  { name: '南京', id: '101190101', pinyin: 'nanjing' },
  { name: '苏州', id: '101190401', pinyin: 'suzhou' },
  { name: '哈尔滨', id: '101050101', pinyin: 'haerbin' },
  { name: '长春', id: '101060101', pinyin: 'changchun' },
  { name: '沈阳', id: '101070101', pinyin: 'shenyang' },
  { name: '石家庄', id: '101090101', pinyin: 'shijiazhuang' },
  { name: '太原', id: '101100101', pinyin: 'taiyuan' },
  { name: '济南', id: '101120101', pinyin: 'jinan' },
  { name: '郑州', id: '101180101', pinyin: 'zhengzhou' },
  { name: '合肥', id: '101220101', pinyin: 'hefei' },
  { name: '南昌', id: '101240101', pinyin: 'nanchang' },
  { name: '福州', id: '101230101', pinyin: 'fuzhou' },
  { name: '长沙', id: '101250101', pinyin: 'changsha' },
  { name: '南宁', id: '101300101', pinyin: 'nanning' },
  { name: '海口', id: '101310101', pinyin: 'haikou' },
  { name: '昆明', id: '101290101', pinyin: 'kunming' },
  { name: '贵阳', id: '101260101', pinyin: 'guiyang' },
  { name: '兰州', id: '101160101', pinyin: 'lanzhou' },
  { name: '西宁', id: '101150101', pinyin: 'xining' },
  { name: '银川', id: '101170101', pinyin: 'yinchuan' },
  { name: '呼和浩特', id: '101080101', pinyin: 'huhehaote' },
  { name: '乌鲁木齐', id: '101130101', pinyin: 'wulumuqi' },
  { name: '拉萨', id: '101140101', pinyin: 'lasa' },
  
  // Major cities
  { name: '青岛', id: '101120201', pinyin: 'qingdao' },
  { name: '大连', id: '101070201', pinyin: 'dalian' },
  { name: '宁波', id: '101210401', pinyin: 'ningbo' },
  { name: '厦门', id: '101230201', pinyin: 'xiamen' },
  { name: '无锡', id: '101190201', pinyin: 'wuxi' },
  { name: '珠海', id: '101280701', pinyin: 'zhuhai' },
  { name: '佛山', id: '101280800', pinyin: 'foshan' },
  { name: '东莞', id: '101281601', pinyin: 'dongguan' },
  { name: '温州', id: '101210301', pinyin: 'wenzhou' },
  { name: '泉州', id: '101230501', pinyin: 'quanzhou' },
  { name: '常州', id: '101191101', pinyin: 'changzhou' },
  { name: '南通', id: '101190801', pinyin: 'nantong' },
  { name: '徐州', id: '101190801', pinyin: 'xuzhou' },
  { name: '扬州', id: '101190701', pinyin: 'yangzhou' },
  { name: '绍兴', id: '101210501', pinyin: 'shaoxing' },
  { name: '嘉兴', id: '101210301', pinyin: 'jiaxing' },
  { name: '湖州', id: '101210201', pinyin: 'huzhou' },
  { name: '金华', id: '101210901', pinyin: 'jinhua' },
  { name: '台州', id: '101210601', pinyin: 'taizhou' },
  { name: '沧州', id: '101090701', pinyin: 'cangzhou' },
  { name: '任丘', id: '101090714', pinyin: 'renqiu' },
];

// Remove duplicates and sort by pinyin
const uniqueCities = Array.from(
  new Map(ALL_CITIES.map(city => [city.id, city])).values()
).sort((a, b) => a.pinyin.localeCompare(b.pinyin));

export const CITIES = uniqueCities;

/**
 * Search cities by name or pinyin
 * @param {string} query - Search query
 * @returns {Array} - Matching cities
 */
export function searchCities(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  return CITIES.filter(city => {
    return (
      city.name.includes(query) ||
      city.pinyin.includes(lowerQuery) ||
      // Support pinyin initials (e.g., "bj" for "beijing")
      city.pinyin.startsWith(lowerQuery)
    );
  });
}

/**
 * Get city location ID by name
 * @param {string} cityName - City name
 * @returns {string} - Location ID or city name if not found
 */
export function getCityId(cityName) {
  const city = CITIES.find(c => c.name === cityName);
  return city ? city.id : cityName;
}

