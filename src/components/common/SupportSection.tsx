const SupportSection = () => {
  const supportItems = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      title: "PASSER COMMANDE",
      description: "Votre guide shopping sur DRESSCODE"
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        </svg>
      ),
      title: "FAQ",
      description: "Toutes nos réponses à vos questions"
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "BESOIN D'AIDE ?",
      description: "Contactez les conseillers de notre Service client"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="text-gray-700 group-hover:text-black transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;