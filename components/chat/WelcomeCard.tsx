"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Zap, History, Shuffle, ArrowRight } from "lucide-react";
import { useChatState } from "@/contexts/ChatStateContext";
import { cn } from "@/lib/utils";

// Provider colors matching CurrentModelDropdown
const providerInfo = {
  OpenAI: {
    name: "OpenAI",
    color: "text-openai",
    bgColor: "bg-openai/10 border-openai/20",
  },
  Anthropic: {
    name: "Anthropic",
    color: "text-anthropic",
    bgColor: "bg-anthropic/10 border-anthropic/20",
  },
  Google: {
    name: "Google",
    color: "text-gemini-blue",
    bgColor: "bg-gemini-blue/10 border-gemini-blue/20",
  },
  xAI: {
    name: "xAI",
    color: "text-black dark:text-white",
    bgColor:
      "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
  },
};

const examplePrompts = [
  "¿Cómo puede la IA automatizar las tareas repetitivas de mi negocio?",
  "Analiza mi logo y dame recomendaciones de marca",
  "Calcula el ROI de implementar IA en mi microempresa",
  "Identifica oportunidades de IA para mi industria específica",
  "Diseña una estrategia de automatización para mi negocio",
];

const features = [
  {
    icon: Shuffle,
    title: "Análisis de Logos y Marca",
    description:
      "Sube tu logo y recibe análisis detallado de diseño, colores y recomendaciones de marca",
  },
  {
    icon: History,
    title: "Cálculos de ROI Personalizados",
    description:
      "Calcula el retorno de inversión específico para tu negocio con métricas reales",
  },
  {
    icon: Zap,
    title: "Estrategias de Automatización",
    description: "Descubre cómo automatizar procesos y trabajar más inteligente, no más duro",
  },
];

export function WelcomeCard() {
  const { setInput, isSendDisabled } = useChatState();
  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4">
      <Card className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background via-background to-muted/30">
        <CardHeader className="text-center pb-2 px-4 sm:px-6 pt-4">
          <div className="flex items-center justify-center mb-1">
            <div className="p-1.5 rounded-full bg-primary/10">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>

          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Bienvenido a Sophia
          </CardTitle>

          <CardDescription className="text-sm sm:text-base md:text-lg mt-1 max-w-xl mx-auto leading-relaxed">
            ¡Hola! Soy Sophia, tu mentora virtual creada por{' '}
            <a 
              href="https://www.identialab.com/es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline decoration-dotted underline-offset-2"
            >
              IdentIA Lab
            </a>
            . Estoy aquí para ayudarte a descubrir cómo la Inteligencia Artificial Generativa puede transformar tu negocio. Piensa en mí como tu compañera de laboratorio - juntos vamos a experimentar, explorar y aprender sobre las oportunidades que la Gen-AI puede ofrecer para tu emprendimiento.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6 pb-4">
          {/* AI Provider Badges */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Impulsado por los principales proveedores de IA
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {Object.entries(providerInfo).map(([key, provider]) => (
                <Badge
                  key={key}
                  variant="outline"
                  className={`${provider.bgColor} ${provider.color} font-medium border px-2.5 py-0.5 text-sm`}
                >
                  {provider.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 md:gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 sm:p-2 md:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 sm:p-1.5 rounded-full bg-primary/10 mb-2 sm:mb-1 md:mb-2">
                    <Icon className="h-4 w-4 sm:h-3 sm:w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 sm:mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Getting Started */}
          <div className="bg-muted/20 rounded-lg p-3 sm:p-4 border border-muted-foreground/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-3 w-3 text-primary" />
              <h3 className="font-semibold text-sm">
                Comienza con estas ideas:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {examplePrompts.map((prompt, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (isSendDisabled) return;
                    setInput(prompt);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background/80 transition-colors group",
                    !isSendDisabled && "cursor-pointer"
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0"></div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    &ldquo;{prompt}&rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
