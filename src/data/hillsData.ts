export type HillsRegionCategory = 'Hill' | 'Mountain Range' | 'Mountain Region';

export interface HillsRegion {
  id: string;
  name: string;
  state: string;
  category: HillsRegionCategory;
  latitude?: number;
  longitude?: number;
  coordinatesVerified: boolean;
  coordinateSource?: string;
}

const HILLS_REGION_DEFINITIONS: Omit<HillsRegion, 'coordinatesVerified'>[] = [
  { id: 'arunachal-mishmi', name: 'Mishmi Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-dafla', name: 'Dafla Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-abor', name: 'Abor Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-miri', name: 'Miri Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-aka', name: 'Aka Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-patkai', name: 'Patkai Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-eastern-himalayas', name: 'Eastern Himalayas', state: 'Arunachal Pradesh', category: 'Mountain Region' },
  { id: 'arunachal-siang', name: 'Siang Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'arunachal-lohit', name: 'Lohit Hills', state: 'Arunachal Pradesh', category: 'Hill' },
  { id: 'assam-karbi-anglong', name: 'Karbi Anglong Hills', state: 'Assam', category: 'Hill' },
  { id: 'assam-north-cachar', name: 'North Cachar Hills (Dima Hasao Hills)', state: 'Assam', category: 'Hill' },
  { id: 'assam-barail', name: 'Barail Hills', state: 'Assam', category: 'Hill' },
  { id: 'assam-borail', name: 'Borail Hills', state: 'Assam', category: 'Hill' },
  { id: 'meghalaya-khasi', name: 'Khasi Hills', state: 'Meghalaya', category: 'Hill' },
  { id: 'meghalaya-jaintia', name: 'Jaintia Hills', state: 'Meghalaya', category: 'Hill' },
  { id: 'meghalaya-garo', name: 'Garo Hills', state: 'Meghalaya', category: 'Hill' },
  { id: 'nagaland-naga', name: 'Naga Hills', state: 'Nagaland', category: 'Hill' },
  { id: 'nagaland-patkai', name: 'Patkai Hills', state: 'Nagaland', category: 'Hill' },
  { id: 'nagaland-barail', name: 'Barail Range', state: 'Nagaland', category: 'Mountain Range' },
  { id: 'nagaland-japfu', name: 'Japfu Range', state: 'Nagaland', category: 'Mountain Range' },
  { id: 'manipur-manipur', name: 'Manipur Hills', state: 'Manipur', category: 'Hill' },
  { id: 'manipur-naga', name: 'Naga Hills', state: 'Manipur', category: 'Hill' },
  { id: 'manipur-patkai', name: 'Patkai Hills', state: 'Manipur', category: 'Hill' },
  { id: 'manipur-shirui', name: 'Shirui Hills', state: 'Manipur', category: 'Hill' },
  { id: 'manipur-koubru', name: 'Koubru Hills', state: 'Manipur', category: 'Hill' },
  { id: 'manipur-thangjing', name: 'Thangjing Hills', state: 'Manipur', category: 'Hill' },
  { id: 'mizoram-mizo', name: 'Mizo Hills (Lushai Hills)', state: 'Mizoram', category: 'Hill' },
  { id: 'mizoram-lushai', name: 'Lushai Hills', state: 'Mizoram', category: 'Hill' },
  { id: 'mizoram-phawngpui', name: 'Phawngpui Hills', state: 'Mizoram', category: 'Hill' },
  { id: 'mizoram-blue-mountain', name: 'Blue Mountain region', state: 'Mizoram', category: 'Mountain Region' },
  { id: 'tripura-jampui', name: 'Jampui Hills', state: 'Tripura', category: 'Hill' },
  { id: 'tripura-atharamura', name: 'Atharamura Hills', state: 'Tripura', category: 'Hill' },
  { id: 'tripura-longtharai', name: 'Longtharai Hills', state: 'Tripura', category: 'Hill' },
  { id: 'tripura-sakhan', name: 'Sakhan Hills', state: 'Tripura', category: 'Hill' },
  { id: 'tripura-baramura', name: 'Baramura Hills', state: 'Tripura', category: 'Hill' },
  { id: 'tripura-deotamura', name: 'Deotamura Hills', state: 'Tripura', category: 'Hill' },
  { id: 'sikkim-singalila', name: 'Singalila Range', state: 'Sikkim', category: 'Mountain Range' },
  { id: 'sikkim-dongkya', name: 'Dongkya Range', state: 'Sikkim', category: 'Mountain Range' },
  { id: 'sikkim-himalaya', name: 'Himalaya ranges of Sikkim', state: 'Sikkim', category: 'Mountain Region' },
];

export const HILL_REGION_METADATA: Record<string, Pick<HillsRegion, 'latitude' | 'longitude' | 'coordinatesVerified' | 'coordinateSource'>> = {
  'arunachal-mishmi': {
    latitude: 29.1,
    longitude: 96.36666667,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Mishmi_Hills',
  },
  'arunachal-abor': {
    latitude: 28.41666667,
    longitude: 94.66666667,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Abor_Hills',
  },
  'assam-karbi-anglong': {
    latitude: 26.183333,
    longitude: 93.566667,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Karbi_Anglong_district',
  },
  'assam-north-cachar': {
    latitude: 25.18,
    longitude: 93.03,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Dima_Hasao_district',
  },
  'assam-barail': {
    latitude: 25,
    longitude: 93.5,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Barail_Range',
  },
  'assam-borail': {
    latitude: 25,
    longitude: 93.5,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Barail_Range',
  },
  'meghalaya-khasi': {
    latitude: 25.58333333,
    longitude: 91.63333333,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Khasi_Hills',
  },
  'meghalaya-garo': {
    latitude: 25.5,
    longitude: 90.33333333,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Garo_Hills',
  },
  'nagaland-naga': {
    latitude: 26,
    longitude: 95,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Naga_Hills',
  },
  'nagaland-barail': {
    latitude: 25,
    longitude: 93.5,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Barail_Range',
  },
  'nagaland-japfu': {
    latitude: 25.5975,
    longitude: 94.06666667,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Mount_Japf%C3%BC',
  },
  'manipur-naga': {
    latitude: 26,
    longitude: 95,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Naga_Hills',
  },
  'manipur-shirui': {
    latitude: 25.12888889,
    longitude: 94.41916667,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Shirui',
  },
  'manipur-koubru': {
    latitude: 25.063,
    longitude: 93.8717,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Mount_Koubru',
  },
  'mizoram-mizo': {
    latitude: 23.16666667,
    longitude: 92.83333333,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Lushai_Hills',
  },
  'mizoram-lushai': {
    latitude: 23.16666667,
    longitude: 92.83333333,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Lushai_Hills',
  },
  'mizoram-phawngpui': {
    latitude: 22.6315,
    longitude: 93.0388,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Phawngpui',
  },
  'mizoram-blue-mountain': {
    latitude: 22.6315,
    longitude: 93.0388,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Phawngpui',
  },
  'tripura-jampui': {
    latitude: 23.965916,
    longitude: 92.277346,
    coordinatesVerified: true,
    coordinateSource: 'https://en.wikipedia.org/wiki/Jampui_Hills',
  },
};

export const HILLS_AND_MOUNTAIN_REGIONS: HillsRegion[] = HILLS_REGION_DEFINITIONS.map((region) => ({
  ...region,
  ...(HILL_REGION_METADATA[region.id] ?? { coordinatesVerified: false }),
}));
