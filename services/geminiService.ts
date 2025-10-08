import { AnalysisSummary, Protocol, ChatMessage } from '../types';
import { SAMPLE_PACKETS } from '../constants';

// This is a mock service. In a real application, you would use @google/genai here.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const runAnalysis = async (tierId: 'quick' | 'standard' | 'comprehensive'): Promise<AnalysisSummary> => {
    console.log(`Running ${tierId} analysis...`);
    await delay(2500);

    const summary: AnalysisSummary = {
        topProtocol: Protocol.HTTP,
        topProtocolPercentage: 69,
        generatedAt: new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        analyzedPackets: 10000,
        totalPackets: 10000,
        threatsDetected: {
            total: 6669,
            high: 4,
            medium: 665,
            low: 6000,
        },
        keyFindings: [
            "Analyzed 10000 packets in this capture",
            "Primary protocol: HTTP (6927 packets, 69%)",
            "Detected 6669 potential security threats (4 high, 665 medium, 0 low severity)",
        ],
        protocolDistribution: [
            { name: 'HTTP', value: 6927 },
            { name: 'HTTPS', value: 1500 },
            { name: 'DNS', value: 800 },
            { name: 'TCP', value: 450 },
            { name: 'UDP', value: 200 },
            { name: 'Other', value: 123 },
        ],
        recommendations: [
            "High severity threats detected - immediate investigation recommended",
            "Web traffic detected - HTTP/HTTPS connections present",
            "DNS queries and responses detected - domain lookups present",
            "Data transfer volumes appear normal for this network size",
        ]
    };

    return summary;
};

export const getChatResponse = async (history: ChatMessage[]): Promise<string> => {
    console.log("Getting chat response for history:", history);
    await delay(2000);

    const lastUserMessage = history[history.length - 1]?.text.toLowerCase() || '';

    if (lastUserMessage.includes('risks')) {
        return `Based on the analysis, the primary risks are:

**High-Severity Threats:**
The 4 high-severity threats indicate potential active attacks or significant vulnerabilities. These require immediate investigation. They could be related to malware communication, exploit attempts, or data exfiltration.

**Unencrypted HTTP Traffic:**
A large portion of the traffic (69%) is unencrypted HTTP. This exposes sensitive information like login credentials or personal data to anyone on the network.

**Recommendations:**
- **Investigate High-Severity Threats:** Isolate affected systems and analyze the specific packets flagged as high-severity.
- **Enforce HTTPS:** Migrate all web services to use HTTPS to encrypt data in transit.
- **Network Segmentation:** Implement network segmentation to limit the impact of a potential breach.
- **Continuous Monitoring:** Implement continuous network monitoring to detect and respond to threats in real-time.

This network capture indicates a serious security situation. Prioritize the actions above to mitigate the risks. Let me know if you want to dive deeper into any of these areas.`;
    }

    return "I am a network assistant powered by Gemini. I can help you analyze the packet capture data. How can I assist you?";
};