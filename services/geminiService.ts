
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisSummary, Protocol, ChatMessage, Packet } from '../types';
import { SAMPLE_PACKETS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSummarySchema = {
    type: Type.OBJECT,
    properties: {
      topProtocol: { type: Type.STRING, enum: Object.values(Protocol) },
      topProtocolPercentage: { type: Type.NUMBER },
      generatedAt: { type: Type.STRING, description: "The timestamp when the analysis was generated, e.g., '6/21/2024, 5:30 PM'" },
      analyzedPackets: { type: Type.INTEGER },
      totalPackets: { type: Type.INTEGER },
      threatsDetected: {
        type: Type.OBJECT,
        properties: {
          total: { type: Type.INTEGER },
          high: { type: Type.INTEGER },
          medium: { type: Type.INTEGER },
          low: { type: Type.INTEGER },
        },
        required: ['total', 'high', 'medium', 'low'],
      },
      keyFindings: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      protocolDistribution: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.INTEGER },
          },
          required: ['name', 'value'],
        },
      },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      'topProtocol', 'topProtocolPercentage', 'generatedAt', 'analyzedPackets',
      'totalPackets', 'threatsDetected', 'keyFindings', 'protocolDistribution',
      'recommendations'
    ],
};


export const runAnalysis = async (tierId: 'quick' | 'standard' | 'comprehensive'): Promise<AnalysisSummary> => {
    console.log(`Running ${tierId} analysis with Gemini...`);

    const packetsToAnalyze = SAMPLE_PACKETS;
    const packetsString = JSON.stringify(packetsToAnalyze.slice(0, 50), null, 2);

    const prompt = `Analyze the following sample of packet capture data and provide a summary. The total packet count is ${packetsToAnalyze.length}.
The data contains a list of network packets with properties like id, time, protocol, source, destination, size, and info.
Based on the analysis, generate a summary that includes:
- The top protocol and its percentage.
- The time of generation (current time, e.g., '6/21/2024, 5:30 PM').
- The number of packets analyzed (which is ${packetsToAnalyze.length}) and the total number of packets (which is ${packetsToAnalyze.length}).
- A breakdown of detected threats by severity (high, medium, low).
- A list of 3-5 key findings from the analysis.
- The distribution of traffic across the top 5 protocols plus an 'Other' category.
- A list of 3-4 actionable recommendations for improving network security.

Here is a sample of the packet data:
${packetsString}

The analysis tier is "${tierId}". Adjust the depth and detail of your analysis accordingly:
- quick: Basic overview, focus on high-level statistics.
- standard: More detailed analysis, identify common anomalies.
- comprehensive: In-depth analysis, correlate events, and provide detailed threat assessments.

Return the response in a JSON format matching the specified schema. For 'generatedAt', use the current date and time.
`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSummarySchema,
            },
        });

        const jsonStr = response.text.trim();
        const summary: AnalysisSummary = JSON.parse(jsonStr);
        return summary;
    } catch (error) {
        console.error("Error calling Gemini API for analysis:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

export const getChatResponse = async (
  history: ChatMessage[],
  analysisSummary: AnalysisSummary | null,
  filteredPackets: Packet[],
  selectedPacket: Packet | null
): Promise<string> => {
    console.log("Getting chat response from Gemini with full context...");
    
    const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n');
    const summaryString = analysisSummary ? JSON.stringify(analysisSummary, null, 2) : "No analysis has been run yet.";

    const filteredPacketsSample = filteredPackets.slice(0, 25);
    const filteredPacketsString = filteredPackets.length > 0
        ? `The user is currently viewing a list of ${filteredPackets.length} packets. Here is a sample of the first ${filteredPacketsSample.length} packets:\n${JSON.stringify(filteredPacketsSample, null, 2)}`
        : "No packets are currently displayed to the user.";

    const selectedPacketString = selectedPacket
        ? `The user has specifically selected the following packet:\n${JSON.stringify(selectedPacket, null, 2)}`
        : "The user has not selected any specific packet.";

    const systemInstruction = `You are a helpful and knowledgeable Network Admin Assistant powered by Gemini. 
You are assisting a user who is analyzing a packet capture file. 
Your role is to answer questions about the network traffic, security risks, and provide recommendations based on the data.
Be concise and clear in your answers. Use markdown for formatting, like **bolding** for emphasis.
The user's chat history is provided below. Respond to the last user message.
When answering, you MUST consider all available context: the overall analysis summary, the list of packets currently displayed on the user's screen, and the specific packet the user has selected (if any). The user's question is likely related to what they are currently seeing.`;

    const contents = `
CONTEXT: OVERALL ANALYSIS SUMMARY
\`\`\`json
${summaryString}
\`\`\`

CONTEXT: CURRENTLY DISPLAYED PACKETS
${filteredPacketsString}

CONTEXT: CURRENTLY SELECTED PACKET
${selectedPacketString}

CHAT HISTORY:
${formattedHistory}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        return "Sorry, I encountered an error while trying to respond. Please try again.";
    }
};
