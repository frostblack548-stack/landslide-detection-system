export type OperationalModule =
  | 'spatial-gis-command'
  | 'temporal-lstm-predictor'
  | 'crowdsource-cv-verification'
  | 'emergency-broadcast-and-dispatch';

export type NerState =
  | 'all'
  | 'sikkim'
  | 'assam'
  | 'meghalaya'
  | 'arunachal'
  | 'manipur'
  | 'nagaland'
  | 'mizoram'
  | 'tripura';

export interface HazardZone {
  id: string;
  name: string;
  subDivision: string;
  corridor: string;
  state: NerState;
  slopeGradient: string;
  soilPoreSaturation: string;
  displacementRate: string;
  pwpPressure: string;
  riskStatus: 'CRITICAL RED' | 'ADVISORY ORANGE' | 'NOMINAL GREEN';
  rfConfidence: string;
  lstmEvac: string;
  highwaySegment: string;
  bridgesExposed: string;
  populationRunout: string;
  coords: string;
  elevation: string;
  top: string;
  left: string;
  isCritical: boolean;
}

export interface SensorNode {
  id: string;
  name: string;
  type: 'piezometer' | 'inclinometer' | 'acoustic' | 'aws';
  typeLabel: string;
  location: string;
  state: NerState;
  coordinates: string;
  battery: string;
  uplink: string;
  lastSync: string;
  currentValue: string;
  currentValueSub?: string;
  warningThreshold: string;
  thresholdPercentage: number;
  status: 'critical' | 'advisory' | 'nominal' | 'torrential';
  statusLabel: string;
  sparkline?: number[];
  depth?: string;
}

export interface CrowdsourceReport {
  id: string;
  code: string;
  location: string;
  subDivision: string;
  state: NerState;
  timeAgo: string;
  reportedTime: string;
  urgency: 'CRITICAL' | 'URGENT' | 'AMBER' | 'ROUTINE';
  verifiedBy: string;
  imageUrl: string;
  imageAlt: string;
  cvRisk: string;
  cvLabel: string;
  cvModel: string;
  summary: string;
  description: string;
  coordinates: string;
  elevation: string;
  slope: string;
  precipitation: string;
  exifStatus: string;
  audioLanguage: string;
  audioDuration: string;
  vernacularText: string;
  englishTranslation: string;
  sensorCorroboration: {
    sensorId: string;
    rate: string;
    thresholdMessage: string;
  };
  boundingBoxes?: Array<{
    label: string;
    confidence: string;
    top: string;
    left: string;
    width: string;
    height: string;
    color: 'error' | 'tertiary' | 'secondary';
    extraInfo?: string;
  }>;
}

export interface TacticalUnit {
  id: string;
  name: string;
  status: 'EN ROUTE' | 'ON SCENE' | 'ACTIVE' | 'DEBRIS CLEARING';
  statusLabel: string;
  eta?: string;
  personnel: number;
  description: string;
  destination: string;
  satcomStatus: string;
  equipment: string[];
  progressPercent: number;
  type: 'ndrf' | 'sdrf' | 'bro';
}

export interface ReliefShelter {
  id: string;
  name: string;
  location: string;
  state: NerState;
  capacityCurrent: number;
  capacityMax: number;
  occupancyPercent: number;
  status: 'CRITICAL' | 'STABLE' | 'AVAILABLE';
  rationsDays: string;
  gensetStatus: string;
  waterSupply?: string;
  medicalActive?: boolean;
}

export interface AuditLogEntry {
  id: string;
  code: string;
  title: string;
  timestamp: string;
  message: string;
  authority: string;
  type: 'order' | 'broadcast' | 'corridor' | 'siren';
  highlight?: boolean;
}
