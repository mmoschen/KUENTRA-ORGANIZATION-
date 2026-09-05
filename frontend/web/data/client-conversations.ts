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
        src: "/testimonials/cliente-01/01.webp",
        alt: "Conversación anonimizada sobre la elección y activación del servicio",
        width: 828,
        height: 1471,
      },
      {
        src: "/testimonials/cliente-01/02.webp",
        alt: "Conversación anonimizada con la confirmación de la transferencia y recepción",
        width: 828,
        height: 1471,
      },
    ],
  },
  {
    id: "cliente-02",
    label: "Cliente 02",
    verificationLabel: "Cliente verificado",
    screenshots: [
      {
        src: "/testimonials/cliente-02/01.webp",
        alt: "Conversación anonimizada con la consulta inicial sobre opciones de ChatGPT Plus",
        width: 828,
        height: 1470,
      },
      {
        src: "/testimonials/cliente-02/02.webp",
        alt: "Conversación anonimizada con la elección del plan y el acceso a la cuenta",
        width: 828,
        height: 1790,
        fit: "cover",
      },
      {
        src: "/testimonials/cliente-02/03.webp",
        alt: "Conversación anonimizada con la coordinación y confirmación del pago",
        width: 828,
        height: 1745,
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
        src: "/testimonials/cliente-03/01.webp",
        alt: "Conversación anonimizada con la entrega del acceso y la confirmación de la transferencia",
        width: 828,
        height: 1471,
      },
    ],
  },
];
