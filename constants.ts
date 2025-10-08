
import { Packet, Protocol, AnalysisTier } from './types';

export const ANALYSIS_TIERS: AnalysisTier[] = [
  {
    id: 'quick',
    name: 'Quick Analysis',
    price: 'Free',
    credits: 0,
    features: [
      'Local analysis with basic pattern detection',
      'Protocol distribution',
      'Basic threat detection',
      'Traffic volume analysis',
    ],
  },
  {
    id: 'standard',
    name: 'Standard AI Analysis',
    price: '1 Credit',
    credits: 1,
    features: [
      'AI-powered analysis with cost optimization',
      'All Standard features',
      'Advanced threat hunting',
      'Network topology insights',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Analysis',
    price: '3 Credits',
    credits: 3,
    recommended: true,
    features: [
      'Full packet analysis with maximum AI processing power',
      'All Detailed features',
      'Full packet inspection',
      'Advanced correlation',
    ],
  },
];


export const SAMPLE_PACKETS: Packet[] = [
  { id: 13, time: '18:52', protocol: Protocol.HTTPS, source: '192.168.3.131', destination: '52.15.72.14', size: 66, info: 'HTTPS Encrypted Traffic' },
  { id: 14, time: '18:52', protocol: Protocol.HTTP, source: '72.14.213.147', destination: '192.168.3.131', size: 54, info: 'GET /api/data' },
  { id: 15, time: '18:52', protocol: Protocol.IPv4, source: '192.168.3.131', destination: '52.15.72.14', size: 60, info: 'Fragmented IP protocol' },
  { id: 16, time: '18:52', protocol: Protocol.HTTPS, source: '52.15.72.14', destination: '192.168.3.131', size: 231, info: 'HTTPS Encrypted Traffic' },
  { id: 17, time: '18:52', protocol: Protocol.ARP, source: '192.168.3.1', destination: 'Broadcast', size: 60, info: 'Who has 192.168.3.131?' },
  { id: 18, time: '18:52', protocol: Protocol.DNS, source: '192.168.3.131', destination: '8.8.8.8', size: 78, info: 'Standard query for google.com' },
  { id: 19, time: '18:52', protocol: Protocol.HTTPS, source: '192.168.3.131', destination: '34.215.72.147', size: 345, info: 'HTTPS Encrypted Traffic' },
  { id: 20, time: '18:52', protocol: Protocol.HTTP, source: '72.14.213.147', destination: '192.168.3.131', size: 329, info: 'POST /login' },
  { id: 21, time: '18:52', protocol: Protocol.TCP, source: '192.168.3.131', destination: '52.15.72.14', size: 54, info: '[SYN] Seq=0 Win=65535' },
  { id: 22, time: '18:52', protocol: Protocol.UDP, source: '192.168.3.131', destination: '52.15.72.14', size: 280, info: 'Port 5353' },
  { id: 23, time: '18:52', protocol: Protocol.HTTPS, source: '34.215.72.147', destination: '192.168.3.131', size: 99, info: 'HTTPS Encrypted Traffic' },
  { id: 24, time: '18:52', protocol: Protocol.ARP, source: '192.168.3.131', destination: 'Broadcast', size: 42, info: 'Who has 192.168.3.1?' },
  { id: 25, time: '18:52', protocol: Protocol.DNS, source: '8.8.8.8', destination: '192.168.3.131', size: 120, info: 'Response: google.com A 172.217.164.174' },
  { id: 26, time: '18:52', protocol: Protocol.IPv4, source: '192.168.3.1', destination: '224.0.0.251', size: 60, info: 'IGMPv2 Membership Report' },
  { id: 27, time: '18:52', protocol: Protocol.TCP, source: '52.15.72.14', destination: '192.168.3.131', size: 54, info: '[SYN, ACK] Seq=0 Ack=1 Win=65535' },
];

for(let i = 28; i <= 100; i++){
    const randomProtocol = Object.values(Protocol)[Math.floor(Math.random() * Object.values(Protocol).length)];
    SAMPLE_PACKETS.push({
        id: i,
        time: '18:53',
        protocol: randomProtocol,
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destination: `52.15.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        size: Math.floor(Math.random() * 1500),
        info: `${randomProtocol} traffic detected`
    });
}
