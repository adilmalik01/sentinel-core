export interface Scan {
  id: string;
  domain: string;
  url: string;
  securityScore: number;
  risk: 'critical' | 'high' | 'medium' | 'low';
  status: 'completed' | 'running' | 'failed';
  timestamp: string;
  vulnerabilities?: Vulnerability[];
  ports?: Port[];
  pages?: string[];
  phishing?: PhishingAnalysis;
  technology?: TechnologyStack;
  ssl?: SSLInfo;
  aiSummary?: string;
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affected?: string;
}

export interface Port {
  number: number;
  service: string;
  state: 'open' | 'closed' | 'filtered';
  risk: 'high' | 'medium' | 'low';
}

export interface PhishingAnalysis {
  detected: boolean;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  indicators: string[];
  description: string;
}

export interface TechnologyStack {
  frameworks: string[];
  server: string;
  cms?: string;
  libraries: string[];
  language?: string;
}

export interface SSLInfo {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  protocol: string;
  httpsEnforced: boolean;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface DashboardStats {
  totalScans: number;
  phishingDetected: number;
  criticalRisks: number;
  averageScore: number;
}
