import { useMemo } from 'react';
import { CategoryWithProducts } from '@/types/category';
import { NavigationData, DropdownContent, NavSection, NavItem } from '@/types/header';

export const useHeaderNavigation = (mainCategories: CategoryWithProducts[] | undefined, isClient: boolean) => {
  const createDropdownContent = (category: CategoryWithProducts): DropdownContent => {
    const sections: NavSection[] = [];

    if (category.children && category.children.length > 0) {
      const childrenToShow = category.children.slice(0, 4);

      childrenToShow.forEach((child) => {
        const items: NavItem[] = [];

        items.push({
          title: `Tous les ${child.name}`,
          link: `/collections/${child.slug}`,
        });

        if (child.children && child.children.length > 0) {
          child.children.slice(0, 5).forEach((grandChild) => {
            items.push({
              title: grandChild.name,
              link: `/collections/${grandChild.slug}`,
            });
          });
        }

        sections.push({
          title: child.name,
          items: items,
        });
      });
    }

    return {
      left: [
        {
          title: `Tous les ${category.name}`,
          link: `/collections/${category.slug}`,
        },
        ...(category.productCount > 0
          ? [
              {
                title: `Nouveautés ${category.name}`,
                link: `/collections/${category.slug}?filter=new`,
              },
            ]
          : []),
      ],
      right: sections,
      featured: category.image
        ? {
            image: category.image,
            title: `Collection ${category.name}`,
            description:
              category.description ||
              `Découvrez notre sélection ${category.name.toLowerCase()} avec ${category.productCount} produits disponibles`,
          }
        : undefined,
    };
  };

  const createDynamicNavigation = (): NavigationData => {
    if (!mainCategories || mainCategories.length === 0) {
      return {};
    }

    const navigationDataLocal: NavigationData = {};
    const sortedCategories = [...mainCategories].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });

    const categoriesToShow = sortedCategories.slice(0, 6);

    categoriesToShow.forEach((category) => {
      const hasChildren = category.children && category.children.length > 0;

      navigationDataLocal[category.name] = {
        hasDropdown: hasChildren,
        link: `/collections/${category.slug}`,
        content: hasChildren ? createDropdownContent(category) : undefined,
      };
    });

    const remainingCategories = sortedCategories.slice(6);
    if (remainingCategories.length > 0) {
      const moreSections: NavSection[] = [];

      for (let i = 0; i < remainingCategories.length; i += 4) {
        const sectionCategories = remainingCategories.slice(i, i + 4);

        moreSections.push({
          title: `Collections ${Math.floor(i / 4) + 1}`,
          items: sectionCategories.map((cat) => ({
            title: cat.name,
            link: `/collections/${cat.slug}`,
          })),
        });
      }

      navigationDataLocal['Plus'] = {
        hasDropdown: true,
        link: '/collections',
        content: {
          left: [
            { title: 'Toutes les collections', link: '/collections' },
            { title: 'Nouveautés', link: '/collections?filter=new' },
            { title: 'Meilleures ventes', link: '/collections?filter=bestsellers' },
          ],
          right: moreSections.slice(0, 3),
          featured: remainingCategories[0]?.image
            ? {
                image: remainingCategories[0].image,
                title: 'Découvrez plus',
                description: `Explorez ${remainingCategories.length} autres collections`,
              }
            : undefined,
        },
      };
    }

    return navigationDataLocal;
  };

  const navigationData = useMemo(() => {
    if (!isClient || !mainCategories || mainCategories.length === 0) {
      return {};
    }
    return createDynamicNavigation();
  }, [isClient, mainCategories]);

  return { navigationData };
};
