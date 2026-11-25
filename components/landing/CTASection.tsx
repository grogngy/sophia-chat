import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="bg-identia-pink py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Trust indicator */}
        <Badge
          variant="secondary"
          className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/25"
        >
          <Users className="w-4 h-4 mr-2" />
          Confiado por 1,000+ microempresarios
        </Badge>

        {/* Main heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
            Transforma Tu Negocio con IA
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Únete a la revolución de la IA. Conversa con múltiples modelos, compara respuestas
          instantáneamente y descubre oportunidades que impulsen tu negocio al siguiente nivel.
        </p>

        {/* CTA buttons */}
        <Button
          size="lg"
          asChild
          className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 group"
        >
          <Link href="/auth/sign-up">
            Comienza Gratis
            <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        {/* Additional trust signal */}
        <p className="text-sm text-white/60 mt-8">
          Sin tarjeta de crédito • Nivel gratuito generoso • Cancela cuando quieras
        </p>
      </div>
    </section>
  );
};

export default CTASection;
