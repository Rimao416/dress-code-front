import Image from 'next/image';
import Link from 'next/link';

interface SectionContent {
  title: string;
  description: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
  fallbackSvg: string;
}

interface SplitSectionProps {
  leftSection: SectionContent;
  rightSection: SectionContent;
}

const SplitSection: React.FC<SplitSectionProps> = ({ leftSection, rightSection }) => {
  const SectionHalf = ({ content, side }: { content: SectionContent; side: 'left' | 'right' }) => (
    <div className="w-full md:w-1/2 relative overflow-hidden group cursor-pointer h-64 sm:h-80 md:h-screen">
      <Image
        src={content.image.src}
        alt={content.image.alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.src = content.fallbackSvg;
        }}
      />
      {/* Superposition Sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
      {/* Contenu */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 text-white z-10">
        <h3 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-wide uppercase"
          dangerouslySetInnerHTML={{ __html: content.title }}
        />
        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 opacity-90 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
          {content.description}
        </p>
        <Link
          href={content.href}
          className="inline-block text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300 transition-colors duration-200 font-medium text-sm sm:text-base"
        >
          Acheter Maintenant
        </Link>
      </div>
    </div>
  );

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:h-screen">
        <SectionHalf content={leftSection} side="left" />
        <SectionHalf content={rightSection} side="right" />
      </div>
    </section>
  );
};

export default SplitSection;