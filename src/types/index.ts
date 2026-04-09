export type Severity = 'High' | 'Medium' | 'Safe';

export interface DisasterProblem {
  type: string;
  confidence: number;
  severity: Severity;
}

export interface DisasterReport {
  id: string;
  timestamp: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  image?: string; // base64
  problems: DisasterProblem[];
  source: 'Camera' | 'Upload' | 'Drone' | 'Satellite';
  status: 'Synced' | 'Pending';
}

export interface RescueTeam {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'Idle' | 'Responding' | 'On Scene';
  targetReportId?: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: Severity;
  timestamp: number;
  location?: {
    lat: number;
    lng: number;
  };
}
