import React from 'react';
import { Packet, AnalysisSummary, Protocol } from '../../types';
import { CheckCircleIcon } from '../common/Icons';

interface DetailsPanelsProps {
  selectedPacket: Packet | null;
  summary: AnalysisSummary | null;
}

// --- Start of new components and logic for Protocol Analysis ---

const TOOLTIP_DEFINITIONS: { [key: string]: string } = {
  'Src': 'Source: The originating address (MAC or IP) of the packet.',
  'Dst': 'Destination: The target address (MAC or IP) of the packet.',
  'Src Port': 'Source Port: The port number on the source host.',
  'Dst Port': 'Destination Port: The port number on the destination host.',
  'Seq': 'Sequence Number: A number used by TCP to identify and order segments of data.',
  'Ack': 'Acknowledgment Number: A number used by TCP to confirm the receipt of data segments.',
  '[SYN]': 'TCP Synchronize Flag: A flag in a TCP packet that signifies the initiation of a connection.',
  '[ACK]': 'TCP Acknowledgment Flag: A flag used to acknowledge the successful receipt of a packet.',
  'Window': 'TCP Window Size: The amount of data that can be sent before an acknowledgment is required.',
  'Total Length': 'The length of the IP datagram in bytes, including header and data.',
  'TTL': 'Time To Live: A mechanism that limits the lifespan of data in a network to prevent it from circulating indefinitely.',
  'Version': 'TLS Version: The version of the Transport Layer Security protocol being used for encryption.'
};


interface ProtocolLayer {
  name: string;
  details: { [key: string]: string | number | boolean };
}

/**
 * Generates a mock protocol layer breakdown for a given packet.
 */
const generateProtocolLayers = (packet: Packet): ProtocolLayer[] => {
  const layers: ProtocolLayer[] = [];

  // Layer 2: Data Link
  layers.push({
    name: 'Ethernet II',
    details: {
      'Src': '00:1B:44:11:3A:B7', // Mocked
      'Dst': 'B8:27:EB:B5:A3:AF', // Mocked
    },
  });

  if ([Protocol.ARP].includes(packet.protocol)) {
    layers.push({
      name: 'Address Resolution Protocol',
      details: {
        'Operation': packet.info.includes('Who has') ? 'request' : 'reply',
        'Info': packet.info,
      },
    });
    return layers;
  }

  // Layer 3: Network
  layers.push({
    name: 'Internet Protocol Version 4',
    details: {
      'TTL': 64, // Mocked TTL
      'Src': packet.source,
      'Dst': packet.destination,
      'Total Length': packet.size,
      'Protocol': packet.protocol,
    },
  });

  if (packet.protocol === Protocol.IPv4) return layers;

  // Layer 4: Transport
  if ([Protocol.TCP, Protocol.HTTP, Protocol.HTTPS].includes(packet.protocol)) {
    layers.push({
      name: 'Transmission Control Protocol',
      details: {
        'Src Port': Math.floor(Math.random() * 40000) + 1024,
        'Dst Port': packet.protocol === Protocol.HTTPS ? 443 : packet.protocol === Protocol.HTTP ? 80 : Math.floor(Math.random() * 500) + 1,
        'Seq': Math.floor(Math.random() * 1000000), // Mocked Seq
        'Ack': packet.info.includes('[ACK]') ? Math.floor(Math.random() * 1000000) : 0, // Mocked Ack
        '[SYN]': packet.info.includes('[SYN]'),
        '[ACK]': packet.info.includes('[ACK]'),
        'Window': 65535,
      },
    });
  } else if ([Protocol.UDP, Protocol.DNS].includes(packet.protocol)) {
    layers.push({
      name: 'User Datagram Protocol',
      details: {
        'Src Port': Math.floor(Math.random() * 40000) + 1024,
        'Dst Port': packet.protocol === Protocol.DNS ? 53 : Math.floor(Math.random() * 500) + 1,
        'Length': packet.size - 28, // Mocked (IP header + UDP header)
      },
    });
  }

  // Layer 7: Application
  switch (packet.protocol) {
    case Protocol.HTTP:
      layers.push({ name: 'Hypertext Transfer Protocol', details: { 'Request Info': packet.info } });
      break;
    case Protocol.HTTPS:
      layers.push({ name: 'Transport Layer Security', details: { 'Version': 'TLS 1.3', 'Content': 'Encrypted Application Data' } });
      break;
    case Protocol.DNS:
      layers.push({
        name: 'Domain Name System',
        details: {
          'Transaction ID': `0x${Math.floor(Math.random() * 0xffff).toString(16)}`,
          'Type': packet.info.includes('query') ? 'Query' : 'Response',
          'Info': packet.info,
        },
      });
      break;
  }

  return layers;
};


const ProtocolBreakdown: React.FC<{ packet: Packet }> = ({ packet }) => {
    const layers = generateProtocolLayers(packet);

    return (
        <div className="space-y-1 text-sm h-full overflow-y-auto">
            {layers.map((layer, index) => (
                <details key={index} className="bg-brand-gray-light rounded group" open>
                    <summary className="font-semibold text-white p-2 cursor-pointer list-none flex items-center group-hover:bg-opacity-70 transition-colors">
                        <svg className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {layer.name}
                    </summary>
                    <div className="p-3 border-t border-brand-gray-dark text-brand-gray-text space-y-1">
                        {Object.entries(layer.details).map(([key, value]) => {
                            const tooltipText = TOOLTIP_DEFINITIONS[key];
                            return (
                                <p key={key} className="font-mono truncate">
                                    {tooltipText ? (
                                        <span
                                            className="text-brand-gray-text mr-2 border-b border-dotted border-brand-gray-text cursor-help"
                                            title={tooltipText}
                                        >
                                            {key}:
                                        </span>
                                    ) : (
                                        <span className="text-brand-gray-text mr-2">{key}:</span>
                                    )}
                                    <span className="text-white">{String(value)}</span>
                                </p>
                            );
                        })}
                    </div>
                </details>
            ))}
        </div>
    );
};


// --- End of new components ---

const DetailCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-brand-gray-dark rounded-lg p-6 h-full flex flex-col">
        <h3 className="font-bold text-white text-lg mb-4 flex-shrink-0">{title}</h3>
        <div className="flex-grow min-h-0">{children}</div>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center text-brand-gray-text h-full">
        <svg className="w-12 h-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>{message}</p>
    </div>
);

const DetailsPanels: React.FC<DetailsPanelsProps> = ({ selectedPacket, summary }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard title="Packet Details">
          {selectedPacket ? (
            <div className="space-y-2 text-sm text-brand-gray-text">
                <p><strong className="text-white">Time:</strong> {selectedPacket.time}</p>
                <p><strong className="text-white">Source:</strong> <span className="font-mono">{selectedPacket.source}</span></p>
                <p><strong className="text-white">Destination:</strong> <span className="font-mono">{selectedPacket.destination}</span></p>
                <p><strong className="text-white">Protocol:</strong> {selectedPacket.protocol}</p>
                <p><strong className="text-white">Size:</strong> {selectedPacket.size} bytes</p>
                <p><strong className="text-white">Info:</strong> <span className="text-white">{selectedPacket.info}</span></p>
            </div>
          ) : (
            <EmptyState message="No packet selected. Click on a packet in the list to view details." />
          )}
        </DetailCard>
        <DetailCard title="Protocol Analysis">
           {selectedPacket ? (
             <ProtocolBreakdown packet={selectedPacket} />
           ) : (
             <EmptyState message="No packet selected. Click on a packet to view protocol details." />
           )}
        </DetailCard>
      </div>

      {summary && (
        <DetailCard title="Summary & AI Analysis">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-brand-gray-text text-sm mb-6">
                <div><strong className="text-white">Top Protocol:</strong> <span className={`px-2 py-1 text-xs font-bold rounded-full bg-brand-green text-brand-dark`}>{summary.topProtocol}</span> {summary.topProtocolPercentage}% of traffic</div>
                <div><strong className="text-white">Generated At:</strong> {summary.generatedAt}</div>
                <div><strong className="text-white">Analyzed Packets:</strong> {summary.analyzedPackets.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-white mb-2">Basic Analysis Findings</h4>
                     <ul className="space-y-2">
                        {summary.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircleIcon className="w-5 h-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-brand-gray-text">{finding}</span>
                          </li>
                        ))}
                     </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-white mb-2">Recommendations</h4>
                     <ul className="space-y-2">
                         {summary.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircleIcon className="w-5 h-5 text-brand-orange mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-brand-gray-text">{rec}</span>
                          </li>
                        ))}
                     </ul>
                </div>
            </div>
            <div className="mt-6 text-right text-sm text-brand-gray-text">
                Analysis complete. You have <strong className="text-white">unlimited</strong> analyses remaining this month.
            </div>
        </DetailCard>
      )}
    </div>
  );
};

export default DetailsPanels;