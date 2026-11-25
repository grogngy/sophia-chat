import { Lightbulb, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Formación Práctica en IA",
      description:
        "Conversaciones guiadas que te enseñan la Inteligencia Artificial Generativa de forma simple y aplicada a tu negocio.",
    },
    {
      icon: Lightbulb,
      title: "Ideas Personalizadas",
      description:
        "Descubre oportunidades específicas de IA para tu industria y tipo de empresa.",
    },
    {
      icon: Rocket,
      title: "Resultados Medibles",
      description:
        "Recibe cálculos de ROI y estrategias para implementar IA en tu negocio desde hoy.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-identia-gray dark:bg-identia-navy"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Por Qué Elegir a Sophia?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Tu mentora Gen-AI que te introduce al mundo de la Inteligencia Artificial 
            con casos prácticos y resultados medibles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in",
                index === 0 && "[animation-delay:0s]",
                index === 1 && "[animation-delay:0.2s]",
                index === 2 && "[animation-delay:0.4s]"
              )}
            >
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
