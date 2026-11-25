import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "¿Cómo empiezo a usar Sophia?",
      answer:
        "Simplemente regístrate con tu email y comienza a conversar con modelos de IA inmediatamente.",
    },
    {
      question: "¿Hay límites para cambiar entre modelos de IA?",
      answer: "No, cambia libremente e instantáneamente dentro de tus conversaciones.",
    },
    {
      question: "¿Qué tan seguros están mis datos de conversación?",
      answer:
        "Todos los datos están encriptados y almacenados de forma segura—tu privacidad es nuestra prioridad.",
    },
    {
      question: "¿Puedo usar diferentes modelos de IA en la misma conversación?",
      answer:
        "Sí, puedes cambiar entre modelos de IA de forma fluida durante tus sesiones de chat.",
    },
    {
      question: "¿Necesito proporcionar mis propias claves API?",
      answer:
        "No, la aplicación viene con acceso a IA integrado - solo regístrate y comienza a chatear.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-identia-pink-light/5 to-identia-gray dark:from-identia-navy dark:to-identia-navy/90"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Todo lo que necesitas saber sobre Sophia.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="mb-4">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
