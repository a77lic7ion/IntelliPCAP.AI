import React from 'react';
import { Packet, Protocol } from '../../types';
import { RightArrowIcon, HttpIcon, HttpsIcon, Ipv4Icon, ArpIcon, DnsIcon, TcpIcon, UdpIcon } from '../common/Icons';

interface PacketTableProps {
  packets: Packet[];
  onPacketSelect: (packet: Packet) => void;
  selectedPacketId?: number | null;
}

const protocolColors: Record<Protocol, string> = {
  [Protocol.HTTPS]: 'bg-brand-purple text-white',
  [Protocol.HTTP]: 'bg-brand-green text-brand-dark',
  [Protocol.IPv4]: 'bg-blue-500 text-white',
  [Protocol.ARP]: 'bg-yellow-500 text-brand-dark',
  [Protocol.DNS]: 'bg-indigo-500 text-white',
  [Protocol.TCP]: 'bg-cyan-500 text-white',
  [Protocol.UDP]: 'bg-pink-500 text-white',
};

const protocolIcons: Record<Protocol, React.FC<{ className?: string }>> = {
  [Protocol.HTTP]: HttpIcon,
  [Protocol.HTTPS]: HttpsIcon,
  [Protocol.IPv4]: Ipv4Icon,
  [Protocol.ARP]: ArpIcon,
  [Protocol.DNS]: DnsIcon,
  [Protocol.TCP]: TcpIcon,
  [Protocol.UDP]: UdpIcon,
};

const PacketTable: React.FC<PacketTableProps> = ({ packets, onPacketSelect, selectedPacketId }) => {
  return (
    <div className="overflow-x-auto max-h-[600px]">
      <table className="w-full text-sm text-left text-brand-gray-text">
        <thead className="text-xs uppercase bg-brand-gray-dark sticky top-0">
          <tr>
            <th scope="col" className="px-3 py-3 w-12"></th>
            <th scope="col" className="px-3 py-3 w-20">#</th>
            <th scope="col" className="px-3 py-3 w-24">Time</th>
            <th scope="col" className="px-3 py-3 w-28">Proto</th>
            <th scope="col" className="px-3 py-3">Source</th>
            <th scope="col" className="px-3 py-3">Dest</th>
            <th scope="col" className="px-3 py-3 w-24">Size</th>
            <th scope="col" className="px-3 py-3">Info</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((packet) => {
            const Icon = protocolIcons[packet.protocol] || null;
            const isSelected = selectedPacketId === packet.id;
            return (
              <tr
                key={packet.id}
                onClick={() => onPacketSelect(packet)}
                className={`border-b border-brand-gray-light hover:bg-brand-gray-light cursor-pointer transition-colors ${isSelected ? 'bg-brand-gray-light' : ''}`}
              >
                <td className={`px-3 py-3 text-white border-l-4 transition-colors ${isSelected ? 'border-brand-green' : 'border-transparent'}`}>
                  <RightArrowIcon className="w-4 h-4" />
                </td>
                <td className="px-3 py-3 font-medium text-white">{packet.id}</td>
                <td className="px-3 py-3">{packet.time}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-bold rounded-full ${protocolColors[packet.protocol] || 'bg-gray-500'}`}>
                    {Icon && <Icon className="w-3 h-3" />}
                    {packet.protocol}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono">{packet.source}</td>
                <td className="px-3 py-3 font-mono">{packet.destination}</td>
                <td className="px-3 py-3">
                  {packet.size}
                  {packet.size > 100 && packet.size < 500 && (
                      <span className="ml-2 text-xs font-semibold bg-brand-orange text-brand-dark px-1.5 py-0.5 rounded">MEDIUM</span>
                  )}
                </td>
                <td className="px-3 py-3 text-white truncate">{packet.info}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PacketTable;