export type ClientConversationScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: "contain" | "cover";
};

export type ClientConversation = {
  id: string;
  label: string;
  verificationLabel: "Cliente verificado" | "Compra real";
  screenshots: ClientConversationScreenshot[];
};

// Las conversaciones se publican solamente cuando sus capturas reales ya fueron
// anonimizadas y se conocen sus dimensiones finales.
export const clientConversations: ClientConversation[] = [
  {
    id: "cliente-01",
    label: "Cliente 01",
    verificationLabel: "Cliente verificado",
    screenshots: [
      {
        src: "/testimonials/cliente-01/01.png",
        alt: "Conversación anonimizada sobre la elección y activación del servicio",
        width: 941,
        height: 1672,
      },
      {
        src: "/testimonials/cliente-01/02.png",
        alt: "Conversación anonimizada con la confirmación de la transferencia y recepción",
        width: 941,
        height: 1672,
      },
    ],
  },
  {
    id: "cliente-02",
    label: "Cliente 02",
    verificationLabel: "Cliente verificado",
    screenshots: [
      {
        src: "/testimonials/cliente-02/01.png",
        alt: "Conversación anonimizada con la consulta inicial sobre opciones de ChatGPT Plus",
        width: 941,
        height: 1671,
      },
      {
        src: "/testimonials/cliente-02/02.png",
        alt: "Conversación anonimizada con la elección del plan y el acceso a la cuenta",
        width: 853,
        height: 1844,
        fit: "cover",
      },
      {
        src: "/testimonials/cliente-02/03.png",
        alt: "Conversación anonimizada con la coordinación y confirmación del pago",
        width: 864,
        height: 1821,
        fit: "cover",
      },
    ],
  },
  {
    id: "cliente-03",
    label: "Cliente 03",
    verificationLabel: "Cliente verificado",
    screenshots: [
      {
        src: "/testimonials/cliente-03/01.png",
        alt: "Conversación anonimizada con la entrega del acceso y la confirmación de la transferencia",
        width: 941,
        height: 1672,
      },
    ],
  },
];
