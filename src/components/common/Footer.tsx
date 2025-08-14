const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">DressCode</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Votre destination mode et lifestyle pour une garde-robe moderne et élégante.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Collections</h4>
            <ul className="space-y-2 text-gray-400">
              {['Femme', 'Homme', 'Enfant', 'Sport'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Aide</h4>
            <ul className="space-y-2 text-gray-400">
              {['Contact', 'FAQ', 'Livraison', 'Retours'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide">Suivez-nous</h4>
            <ul className="space-y-2 text-gray-400">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="text-sm">&copy; 2025 DressCode. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;