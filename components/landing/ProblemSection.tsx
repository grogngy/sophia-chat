const ProblemSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-identia-pink-light/10 to-identia-gray dark:from-identia-navy dark:to-identia-navy/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            El Mayor Desafío de los Dueños de Microempresas—
            <span className="text-primary">Resuelto</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>

              <div className="flex-1">
                <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-400 mb-6 italic">
                  &ldquo;Sophia me ayudó a entender cómo la IA puede transformar mi salón de belleza. 
                  En solo una semana implementé estrategias que aumentaron mis ingresos un 30%.&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      María González
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Propietaria, Salón Bella Vista
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
