"use client"
import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';

const LumeHomepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre supérieure */}
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>(+01) 1234 8888</span>
            </div>
            <div className="hidden md:block">
              <span>Livraison gratuite, retour ou remboursement sous 30 jours.</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>FRANÇAIS</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1">
                <span>EUR €</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Menu de navigation - Bureau */}
            <nav className="hidden lg:flex space-x-8">
              <div className="flex items-center space-x-1">
                <span className="text-gray-900 font-medium">ACCUEIL</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-900 font-medium">BOUTIQUE</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <span className="text-gray-900 font-medium">BLOG</span>
              <span className="text-gray-900 font-medium">CONTACT</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-900 font-medium">PAGES</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </nav>

            {/* Bouton du menu mobile */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <div className="text-3xl font-bold text-gray-900">
                <span className="italic">D</span>RESSCODE
              </div>
            </div>

            {/* Icônes de droite */}
            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 text-gray-600 cursor-pointer" />
              <User className="w-6 h-6 text-gray-600 cursor-pointer" />
              <div className="relative">
                <Heart className="w-6 h-6 text-gray-600 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-600 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t">
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">ACCUEIL</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">BOUTIQUE</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <span className="text-gray-900 font-medium block">BLOG</span>
                <span className="text-gray-900 font-medium block">CONTACT</span>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">PAGES</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Section Hero */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-[600px]">
            {/* Contenu de gauche */}
            <div className="lg:w-1/2 text-center lg:text-left py-12 lg:py-0">
              <div className="mb-4">
                <span className="text-gray-600 text-sm">Soldes jusqu à 30% de réduction</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Style décontracté<br />
                avec impact
              </h1>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-300">
                ACHETER MAINTENANT
              </button>
            </div>

            {/* Contenu de droite - Image */}
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                {/* Image principale */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-80 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                    <p className="text-gray-600">Image des modèles masculins</p>
                  </div>
                </div>

                {/* Éléments flottants */}
               
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section Caractéristiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border border-gray-400 rounded"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Livraison gratuite</h3>
              <p className="text-gray-600">Livraison gratuite pour les commandes de plus de 65€.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-4 border border-gray-400 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Retours gratuits</h3>
              <p className="text-gray-600">Politique de retour sous 30 jours.</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-4 border border-gray-400 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Paiements sécurisés</h3>
              <p className="text-gray-600">Nous acceptons toutes les cartes bancaires</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border border-gray-400 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service client</h3>
              <p className="text-gray-600">Service client de haute qualité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image de gauche */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-80 h-96 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                    <p className="text-gray-600">Couple en tenue décontractée</p>
                  </div>
                </div>
                {/* Badge Collection Design */}
                <div className="absolute top-4 right-4 bg-white rounded-full p-4">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="text-xs text-gray-600 text-center">
                      <div>COLLECTION</div>
                      <div>DESIGNER</div>
                      <div>NOUVEAU</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu de droite */}
            <div className="lg:w-1/2">
              <div className="mb-4">
                <span className="text-gray-600 text-sm">À propos de nous</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Exprimez-vous<br />
                à travers la mode
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Notre objectif est d aider les gens à exprimer librement leur personnalité à travers la mode. Notre équipe passionnée permet à nos clients d utiliser la mode comme moyen d expression en les inspirant avec une gamme variée de marques et de styles.
              </p>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                LIRE PLUS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories populaires */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Catégories populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Chemises */}
            <div className="relative group cursor-pointer">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-48 h-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                  <p className="text-gray-600">Chemise femme</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                15 Articles
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-center py-4 rounded-b-lg">
                <span className="font-medium">Chemises</span>
              </div>
            </div>

            {/* Robe mi-longue */}
            <div className="relative group cursor-pointer">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-48 h-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                  <p className="text-gray-600">Robe mi-longue</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                15 Articles
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-center py-4 rounded-b-lg">
                <span className="font-medium">Robe mi-longue</span>
              </div>
            </div>

            {/* Chemises */}
            <div className="relative group cursor-pointer">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-48 h-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                  <p className="text-gray-600">Blazer femme</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                15 Articles
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-center py-4 rounded-b-lg">
                <span className="font-medium">Chemises</span>
              </div>
            </div>

            {/* Vestes */}
            <div className="relative group cursor-pointer">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-48 h-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                  <p className="text-gray-600">Veste homme</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                15 Articles
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-center py-4 rounded-b-lg">
                <span className="font-medium">Vestes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avis clients */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Nos clients adorent</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Avis 1 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg p-8">
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-40 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                    <p className="text-gray-600">Homme en veste</p>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les résultats de l utilisation de cutegiz ont été immédiats pour moi, et ce sont d excellents résultats ! Je suis heureux d avoir trouvé la bonne crème, et en plus, elle est complètement naturelle. Bravo !
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Michael Smith</p>
                  <p className="text-gray-600 text-sm">designer produit</p>
                </div>
              </div>
            </div>

            {/* Avis 2 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg p-8">
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-40 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                    <p className="text-gray-600">Homme en cuir</p>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les résultats de l utilisation de cutegiz ont été immédiats pour moi, et ce sont d excellents résultats ! Je suis heureux d avoir trouvé la bonne crème, et en plus, elle est complètement naturelle. Bravo !
                </p>
                <div>
                  <p className="font-semibold text-gray-900">Janet Chua</p>
                  <p className="text-gray-600 text-sm">Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Instagram */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Suivez-nous sur Instagram</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Post Instagram 1 */}
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Homme casual</p>
                </div>
              </div>
            </div>

            {/* Post Instagram 2 */}
            <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Femme blonde</p>
                </div>
              </div>
            </div>

            {/* Post Instagram 3 */}
            <div className="aspect-square bg-gradient-to-br from-mint-100 to-mint-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Femme pull</p>
                </div>
              </div>
            </div>

            {/* Post Instagram 4 */}
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Homme lunettes</p>
                </div>
              </div>
            </div>

            {/* Post Instagram 5 */}
            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Femme chapeau</p>
                </div>
              </div>
            </div>

            {/* Post Instagram 6 */}
            <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white/20 rounded mb-2 mx-auto"></div>
                  <p className="text-xs text-gray-600">Femme manteau</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Info entreprise */}
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                <span className="italic">D</span>RESSCODE
              </div>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  <span className="text-gray-600">123 rue principale, ville, CA 12345 - France.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  <span className="text-gray-600">dresscode@example.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  <span className="text-gray-600">(012) 800 456 789-987</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-xs">ig</span>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-xs">yt</span>
                </div>
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Liens rapides</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Mon compte</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Panier</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Liste de souhaits</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Politique de confidentialité</a></li>
              </ul>
            </div>

            {/* Informations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">À propos de nous</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Carrières</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Informations de livraison</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Conditions générales</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Rejoignez notre newsletter</h3>
              <p className="text-gray-600 mb-6">
                Recevez des e-mails sur nos dernières offres et promotions.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors">
                  S ABONNER
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de pied de page */}
        <div className="bg-gray-900 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">Copyright © 2025 par spacingtech</p>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center">VISA</div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center">MC</div>
                <div className="w-8 h-5 bg-blue-700 rounded text-xs text-white flex items-center justify-center">AMEX</div>
                <div className="w-8 h-5 bg-blue-500 rounded text-xs text-white flex items-center justify-center">PP</div>
                <div className="w-8 h-5 bg-blue-800 rounded text-xs text-white flex items-center justify-center">DC</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LumeHomepage;