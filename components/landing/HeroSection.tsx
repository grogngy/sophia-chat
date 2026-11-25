"use client";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Bot,
  User,
  Zap,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [currentModel, setCurrentModel] = useState<
    "gpt4" | "claude" | "gemini"
  >("gpt4");

  // Continuous conversation with model switching and scroll effect
  useEffect(() => {
    const sequence = [
      { step: 0, delay: 1000 }, // User message 1 appears
      { step: 1, delay: 1200 }, // GPT-4 responds
      { step: 2, delay: 1500 }, // Switch to Claude
      { step: 3, delay: 800 }, // User message 2 appears (scroll effect starts)
      { step: 4, delay: 1200 }, // Claude responds
      { step: 5, delay: 1500 }, // Switch to Gemini
      { step: 6, delay: 800 }, // User message 3 appears (more scroll effect)
      { step: 7, delay: 1200 }, // Gemini responds
      { step: 8, delay: 1500 }, // Brief pause before seamless restart
    ];

    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      // Reset timing for each cycle to avoid accumulating delays between loops
      let currentTime = 0;
      sequence.forEach(({ step, delay }) => {
        const timeout = setTimeout(() => {
          setAnimationStep(step);
          if (step === 2) {
            setCurrentModel("claude");
          } else if (step === 5) {
            setCurrentModel("gemini");
          } else if (step === 0) {
            setCurrentModel("gpt4");
          }
        }, currentTime);
        timeouts.push(timeout);
        currentTime += delay;
      });

      // Seamless loop restart
      const loopTimeout = setTimeout(() => {
        setAnimationStep(0);
        setCurrentModel("gpt4");
        runSequence();
      }, currentTime);
      timeouts.push(loopTimeout);
    };

    runSequence();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section
      className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-identia-gray via-identia-pink-light/20 to-identia-gray/30 dark:from-identia-navy dark:via-identia-navy/95 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background Grid decoration */}
      <div
        className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl"
        aria-hidden="true"
      >
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-identia-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-60 h-60 sm:w-96 sm:h-96 bg-identia-pink-light/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-52 h-52 sm:w-80 sm:h-80 bg-identia-pink/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-2 sm:px-4 sm:py-2 mb-4 sm:mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Todos los modelos de IA principales en un solo lugar
            </span>
          </div>

          {/* Main headline */}
          <h1
            id="hero-title"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 leading-tight animate-fade-in-delay-1"
          >
            Descubre el Potencial de la <span className="text-primary">IA Generativa</span>{" "}
            <br className="hidden sm:block" />
            para Tu Negocio
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2 px-2 sm:px-0">
            Sophia te introduce y acompaña en el mundo de la <span className="font-semibold text-primary">Inteligencia Artificial</span>.{" "}
            Aprende cómo la <span className="font-semibold text-primary">IA</span> puede generar resultados reales para tu empresa.
          </p>

          {/* Feature highlights */}
          <div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400 animate-fade-in-delay-2"
            role="list"
            aria-label="Características principales"
          >
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-primary dark:hover:text-primary transition-colors"
              role="listitem"
            >
              <Sparkles
                className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                aria-hidden="true"
              />
              <span>Casos de uso prácticos</span>
            </div>
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-primary dark:hover:text-primary transition-colors"
              role="listitem"
            >
              <Bot
                className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                aria-hidden="true"
              />
              <span>Aprende con ejemplos reales</span>
            </div>
            <div
              className="flex items-center gap-1.5 sm:gap-2 hover:text-primary dark:hover:text-primary transition-colors"
              role="listitem"
            >
              <Zap
                className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                aria-hidden="true"
              />
              <span>Impulsa productividad e ingresos</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 animate-fade-in-delay-3 px-4 sm:px-0">
            <Button
              size="default"
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 group w-full sm:w-auto focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center gap-2"
                aria-describedby="cta-description"
              >
                Comienza Ahora
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              size="default"
              variant="outline"
              asChild
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 sm:hidden"
            >
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center"
              >
                Comenzar
              </Link>
            </Button>
          </div>
          <div id="cta-description" className="sr-only">
            Regístrate gratis para comenzar a usar todos los modelos de IA en un solo lugar
          </div>

          {/* Sidebar Scroll Demo - Hidden on mobile */}
          <motion.div
            id="demo"
            className="relative max-w-6xl mx-auto hidden md:block"
            role="img"
            aria-label="Demo showing seamless conversation flow between AI models"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Floating indicators */}
            <motion.div
              className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              🎯 Cambia modelos sin problemas
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              💬 Una conversación fluida
            </motion.div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Browser header */}
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                  sophia.identialab.com
                </div>
              </div>

              <div className="h-[480px] flex">
                {/* AI Models Sidebar */}
                <div className="w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Modelos de IA
                  </h3>
                  <div className="space-y-3">
                    {/* GPT-4 */}
                    <motion.div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        currentModel === "gpt4"
                          ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      animate={{
                        scale: currentModel === "gpt4" ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            currentModel === "gpt4"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          GPT-5
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          OpenAI
                        </div>
                      </div>
                      {currentModel === "gpt4" && (
                        <motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>

                    {/* Claude */}
                    <motion.div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        currentModel === "claude"
                          ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      animate={{
                        scale: currentModel === "claude" ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            currentModel === "claude"
                              ? "text-orange-700 dark:text-orange-300"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          Claude
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Anthropic
                        </div>
                      </div>
                      {currentModel === "claude" && (
                        <motion.div
                          className="w-2 h-2 bg-orange-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>

                    {/* Gemini */}
                    <motion.div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        currentModel === "gemini"
                          ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      animate={{
                        scale: currentModel === "gemini" ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            currentModel === "gemini"
                              ? "text-purple-700 dark:text-purple-300"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          Gemini
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Google
                        </div>
                      </div>
                      {currentModel === "gemini" && (
                        <motion.div
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {/* Messages area - continuous conversation with scroll effect */}
                  <div className="flex-1 p-6 overflow-hidden relative">
                    <motion.div
                      className="space-y-4 h-full"
                      layout
                      transition={{ layout: { duration: 0.35 } }}
                    >
                      {/* Message 1: User question - slides out when message 4 appears */}
                      <AnimatePresence>
                        {animationStep >= 0 && animationStep < 4 && (
                          <motion.div
                            className="flex items-start gap-3"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-1"
                          >
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                Ayúdame a planificar el lanzamiento de mi producto
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message 2: GPT-4 response - slides out when message 5 appears */}
                      <AnimatePresence>
                        {animationStep >= 1 && animationStep < 6 && (
                          <motion.div
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-2"
                          >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="max-w-[85%]">
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                GPT-5
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  Crea una cronología, identifica tu audiencia objetivo,
                                  prepara materiales de marketing y planifica tu
                                  secuencia de lanzamiento.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message 3: User follow-up - slides out when message 6 appears */}
                      <AnimatePresence>
                        {animationStep >= 3 && animationStep < 7 && (
                          <motion.div
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-3"
                          >
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                Hazlo más creativo y atractivo
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message 4: Claude response - visible from step 4 onward */}
                      <AnimatePresence>
                        {animationStep >= 4 && (
                          <motion.div
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-4"
                          >
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="max-w-[85%]">
                              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">
                                Claude
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border-l-4 border-orange-500">
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  ¡Excelente plan! Añade storytelling: cuenta regresiva de lanzamiento,
                                  contenido detrás de escena, programa de acceso temprano para usuarios
                                  y eventos de celebración.
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <Shield className="w-3 h-3" />
                                  <span>
                                    Construyendo sobre la cronología de GPT-5
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message 5: User third question - visible from step 6 onward */}
                      <AnimatePresence>
                        {animationStep >= 6 && (
                          <motion.div
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-5"
                          >
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                ¿Cómo mido el éxito?
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Message 6: Gemini response - visible from step 7 onward */}
                      <AnimatePresence>
                        {animationStep >= 7 && (
                          <motion.div
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout="position"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              duration: 0.4,
                              layout: { duration: 0.35 },
                            }}
                            key="message-6"
                          >
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="max-w-[85%]">
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                                Gemini
                              </div>
                              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border-l-4 border-purple-500">
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  Rastrea registros, tasas de participación, métricas de conversión
                                  y comentarios de usuarios. Configura análisis
                                  para cada elemento de campaña del plan.
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    Contexto completo de todas las respuestas anteriores
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Input area */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <input
                        type="text"
                        placeholder="Pregunta a cualquier modelo de IA..."
                        className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none"
                        disabled
                      />
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
