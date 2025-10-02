export interface HeaderProps {
  forceScrolledStyle?: boolean;
}

export interface NavItem {
  title: string;
  link: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface DropdownContent {
  left: NavItem[];
  right: NavSection[];
  featured?: {
    image: string;
    title: string;
    description: string;
  };
}

export interface NavigationItem {
  hasDropdown: boolean;
  link: string;
  content?: DropdownContent;
}

export type NavigationData = Record<string, NavigationItem>;
