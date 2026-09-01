export type ClientConversationScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ClientConversation = {
  id: string;
  label: string;
  verificationLabel: "Cliente verificado" | "Compra real";
  screenshots: ClientConversationScreenshot[];
};

// Las conversaciones se publican solamente cuando sus capturas reales ya fueron
// anonimizadas y se conocen sus dimensiones finales.
export const clientConversations: ClientConversation[] = [];
