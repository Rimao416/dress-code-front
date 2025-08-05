import Image from 'next/image'
import React from 'react'

function Footer() {
  return (
    <footer className="bg-white border-t">
        {/* Moyens de paiement */}
        <div className="border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Moyens de paiement</h3>
            <div className="flex space-x-4">
              {/* <Image src="https://via.placeholder.com/40x25/0052CC/FFFFFF?text=AMEX" alt="American Express" className="h-6" fill />
              <Image src="https://via.placeholder.com/40x25/EB001B/FFFFFF?text=MC" alt="Mastercard" className="h-6" fill />
              <Image src="https://via.placeholder.com/40x25/1A1F71/FFFFFF?text=VISA" alt="Visa" className="h-6" fill />
              <Image src="https://via.placeholder.com/40x25/003087/FFFFFF?text=PP" alt="PayPal" className="h-6" fill /> */}
            </div>
          </div>
        </div>

        {/* Liens footer */}
        <div className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Service client */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Service client</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Aide & contact</a></li>
                  <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
                  <li><a href="#" className="hover:text-gray-900">Commandes & livraison</a></li>
                  <li><a href="#" className="hover:text-gray-900">Retours & remboursements</a></li>
                  <li><a href="#" className="hover:text-gray-900">Paiements & tarification</a></li>
                  <li><a href="#" className="hover:text-gray-900">Paiements en crypto-monnaie</a></li>
                  <li><a href="#" className="hover:text-gray-900">Conditions des promotions</a></li>
                  <li><a href="#" className="hover:text-gray-900">La garantie DRESSCODE</a></li>
                </ul>
              </div>

              {/* À propos de DRESSCODE */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">À propos de DRESSCODE</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">À propos de nous</a></li>
                  <li><a href="#" className="hover:text-gray-900">Boutiques partenaires DRESSCODE</a></li>
                  <li><a href="#" className="hover:text-gray-900">Carrières (site en anglais)</a></li>
                  <li><a href="#" className="hover:text-gray-900">Appli DRESSCODE</a></li>
                  <li><a href="#" className="hover:text-gray-900">Déclarations sur l'esclavage moderne</a></li>
                  <li><a href="#" className="hover:text-gray-900">DRESSCODE Advertising</a></li>
                </ul>
              </div>

              {/* Programme de fidélité */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Programme de fidélité</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Programme d'affiliation</a></li>
                  <li><a href="#" className="hover:text-gray-900">Programme de parrainage</a></li>
                  <li><a href="#" className="hover:text-gray-900">Programme de fidélité</a></li>
                  <li><a href="#" className="hover:text-gray-900">Student Beans & Diplômé·es</a></li>
                </ul>
              </div>

              {/* Suivez-nous */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Suivez-nous</h4>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bas */}
        <div className="bg-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-gray-900">Politique de confidentialité</a>
                <a href="#" className="hover:text-gray-900">Terms & conditions</a>
                <a href="#" className="hover:text-gray-900">Accessibilité</a>
              </div>
           
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer
