export enum Protocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  IPv4 = 'IPv4',
  ARP = 'ARP',
  DNS = 'DNS',
  TCP = 'TCP',
  UDP = 'UDP',
}

export interface Packet {
  id: number;
  time: string;
  protocol: Protocol;
  source: string;
  destination: string;
  size: number;
  info: string;
}

export type AnalysisTier = {
  id: 'quick' | 'standard' | 'comprehensive';
  name: string;
  price: string;
  credits: number;
  features: string[];
  recommended?: boolean;
};

export interface AnalysisSummary {
  topProtocol: Protocol;
  topProtocolPercentage: number;
  generatedAt: string;
  analyzedPackets: number;
  totalPackets: number;
  threatsDetected: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  keyFindings: string[];
  protocolDistribution: { name: string; value: number }[];
  recommendations: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
}