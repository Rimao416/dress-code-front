export interface NavLink {
  title: string;
  link: string;
}

export interface NavSection {
  title: string;
  items?: NavLink[];
}

export interface FeaturedItem {
  title: string;
  description: string;
  image: string;
}
export interface DropdownContent {
  left: NavLink[];
  right: NavSection[];
  featured?: FeaturedItem | FeaturedItem[];
}

export interface NavigationItem {
  hasDropdown: boolean;
  content?: DropdownContent;
  link?: string;
}

export interface NavigationData {
  [key: string]: NavigationItem;
}

export const navigationData: NavigationData = {
    'Vêtements': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les vêtements', link: '/clothing' },
          { title: 'Tous les vêtements de détente', link: '/clothing/loungewear' },
          { title: 'Guide des tissus', link: '/clothing/fabric-guide' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'T-shirts & débardeurs', link: '/clothing/tees-tanks' },
              { title: 'Robes', link: '/clothing/dresses' },
              { title: 'Bodys', link: '/clothing/bodysuits' },
              { title: 'Bas', link: '/clothing/bottoms' },
              { title: 'Sweats à capuche et sweatshirts', link: '/clothing/hoodies' },
              { title: 'Pyjamas', link: '/clothing/pajamas' },
              { title: 'Maternité', link: '/clothing/maternity' }
            ]
          }
        ],
        featured: {
          title: 'La boutique des robes',
          description: 'Robes signature pour toutes les occasions',
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop'
        }
      }
    },
    'Soutiens-gorge': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les soutiens-gorge', link: '/bras' },
          { title: 'Tous les brassières', link: '/bras/bralettes' },
          { title: 'Lingerie', link: '/bras/lingerie' },
          { title: 'Le guide des soutiens-gorge', link: '/bras/guide' }
        ],
        right: [
          {
            title: 'Silhouette',
            items: [
              { title: 'T-shirt', link: '/bras/t-shirt' },
              { title: 'Sans bretelles', link: '/bras/strapless' },
              { title: 'Couverture intégrale', link: '/bras/full-coverage' },
              { title: 'Décolleté', link: '/bras/scoop' },
              { title: 'Plongeant', link: '/bras/plunge' },
              { title: 'Balconnet', link: '/bras/balconette' },
              { title: 'Triangle', link: '/bras/triangle' },
              { title: 'Demi', link: '/bras/demi' },
              { title: 'Maternité', link: '/bras/maternity' }
            ]
          },
          {
            title: 'Doublure',
            items: [
              { title: 'Push-up', link: '/bras/push-up' },
              { title: 'Non doublé', link: '/bras/unlined' },
              { title: 'Légèrement doublé', link: '/bras/lightly-lined' }
            ]
          }
        ],
        featured: [
          {
            title: 'Soutiens-gorge T-shirt',
            description: 'Modèles du quotidien avec soutien et couverture indétectable',
            image: 'https://images.unsplash.com/photo-1571513722275-4b8c0290cd54?w=150&h=120&fit=crop'
          },
          {
            title: 'Soutiens-gorge Push-up',
            description: 'Styles sexy qui mettent en valeur le décolleté, soulèvent et soutiennent',
            image: 'https://images.unsplash.com/photo-1594736797933-d0c44efab1eb?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Sous-vêtements': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les sous-vêtements', link: '/underwear' },
          { title: 'Kits économiques', link: '/underwear/bundles' },
          { title: 'Lingerie', link: '/underwear/lingerie' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Strings', link: '/underwear/thongs' },
              { title: 'Shorty', link: '/underwear/cheeky' },
              { title: 'Slips', link: '/underwear/briefs' },
              { title: 'Culottes boy short', link: '/underwear/boy-shorts' },
              { title: 'Boxers', link: '/underwear/boxers' },
              { title: 'Maternité', link: '/underwear/maternity' }
            ]
          }
        ],
        featured: {
          title: 'Kits économiques',
          description: 'Videz vos tiroirs ! Obtenez plus de sous-vêtements que vous adorerez, pour moins cher',
          image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=200&fit=crop'
        }
      }
    },
    'Gainage': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les vêtements de gainage', link: '/shapewear' },
          { title: 'Solutions pour occasions', link: '/shapewear/occasions' },
          { title: 'Le guide du gainage', link: '/shapewear/guide' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Bodys', link: '/shapewear/bodysuits' },
              { title: 'Sous-vêtements', link: '/shapewear/underwear' },
              { title: 'Shorts & leggings', link: '/shapewear/shorts-leggings' },
              { title: 'Redresseurs de taille', link: '/shapewear/waist-trainers' },
              { title: 'Sans dos', link: '/shapewear/backless' },
              { title: 'Brassières', link: '/shapewear/bralettes' }
            ]
          },
          {
            title: 'Niveau de compression',
            items: [
              { title: 'Léger', link: '/shapewear/light' },
              { title: 'Moyen', link: '/shapewear/mid' },
              { title: 'Fort', link: '/shapewear/strong' },
              { title: 'Très fort', link: '/shapewear/extra-strong' }
            ]
          }
        ],
        featured: [
          {
            title: 'Bodys',
            description: 'Styles galbants qui lissent, sculptent et soutiennent',
            image: 'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=150&h=120&fit=crop'
          },
          {
            title: 'La boutique des solutions',
            description: 'Le soutien-gorge qui fait tout, nos bodys viraux et autres solutions indispensables',
            image: 'https://images.unsplash.com/photo-1582142306909-195724d44209?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Maillots de bain': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Tous les maillots de bain', link: '/swim' }
        ],
        right: [
          {
            title: 'Style',
            items: [
              { title: 'Bikinis deux pièces', link: '/swim/two-piece' },
              { title: 'Maillots une pièce', link: '/swim/one-piece' },
              { title: 'Paréos', link: '/swim/cover-ups' },
              { title: 'Accessoires de plage', link: '/swim/accessories' }
            ]
          }
        ],
        featured: [
          {
            title: 'Bikinis deux pièces',
            description: 'Hauts et bas de bikini indispensables',
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=120&fit=crop'
          },
          {
            title: 'Maillots une pièce',
            description: 'Silhouettes signature pour un look de plage complet',
            image: 'https://images.unsplash.com/photo-1544966503-7521ac882d5a?w=150&h=120&fit=crop'
          }
        ]
      }
    },
    'Homme': {
      hasDropdown: false,
      link: '/mens'
    },
    'Collections': {
      hasDropdown: true,
      content: {
        left: [
          { title: 'Toutes les collections', link: '/collections' }
        ],
        right: [
          {
            title: 'Collections phares',
            items: [
              { title: 'Fits Everybody', link: '/collections/fits-everybody' },
              { title: 'Collection coton', link: '/collections/cotton' },
              { title: 'Soft Lounge', link: '/collections/soft-lounge' },
              { title: 'DRESSCODE Body', link: '/collections/dresscode-body' },
              { title: 'Seamless Sculpt', link: '/collections/seamless-sculpt' },
              { title: 'Coton polaire', link: '/collections/cotton-fleece' }
            ]
          },
          {
            title: 'Boutiques',
            items: [
              { title: 'La collection vacances', link: '/shops/vacation' },
              { title: 'La boutique été', link: '/shops/summer' },
              { title: 'Transparences', link: '/shops/sheer' },
              { title: 'Lingerie d\'été', link: '/shops/intimates' },
              { title: 'Perfection imprimée', link: '/shops/prints' },
              { title: 'Nuances d\'été', link: '/shops/shades' },
              { title: 'Boutique mariage', link: '/shops/wedding' },
              { title: 'Ensembles deux pièces', link: '/shops/two-piece-sets' },
              { title: 'La boutique nuit', link: '/shops/sleep' },
              { title: 'Sélection de Kim', link: '/shops/kims-picks' }
            ]
          }
        ]
      }
    },
    'Plus': {
      hasDropdown: true,
      content: {
        left: [],
        right: [
          {
            title: 'Plus de DRESSCODE à aimer',
            items: [
              { title: 'Accessoires', link: '/more/accessories' },
              { title: 'Chaussettes & collants', link: '/more/socks-hosiery' },
              { title: 'Chaussures', link: '/more/footwear' },
              { title: 'Cartes cadeaux', link: '/more/gift-cards' }
            ]
          }
        ]
      }
    }
  };