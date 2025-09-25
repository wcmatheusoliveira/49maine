import { prisma } from '../src/lib/prisma';

async function updateHeroSection() {
  try {
    // Find the hero section
    const heroSection = await prisma.section.findFirst({
      where: { type: 'hero' }
    });

    if (!heroSection) {
      console.error('No hero section found!');
      return;
    }

    console.log('Found hero section:', heroSection.id);

    // Update with all the new fields
    const updatedHero = await prisma.section.update({
      where: { id: heroSection.id },
      data: {
        data: JSON.stringify({
          headline: 'Come hungry, <span style="font-family: \'adventures-unlimited\', serif; font-size: 1.2em; font-style: italic;">leave happy</span>',
          tagline: 'Wood-fired goodness in the heart of Lincoln, Maine',
          specialAnnouncement: "Tonight's Special: Half-Price Wings After 8PM",
          valueProps: [
            'Serving Lincoln Since 2020',
            '4.8 Stars on Google',
            'Kids Eat Free Tuesdays',
            'Happy Hour 5-6PM Daily'
          ],
          showOpenStatus: true,
          openStatusText: 'Open Now • Closes at 10PM',
          showLocallyOwned: true,
          locallyOwnedText: 'Locally Owned & Operated',
          backgroundVideo: '/49maine-hero.mp4',
          overlayOpacity: 0.4,
          ctaButtons: [
            { text: 'See Menu & Order', url: '#menu', variant: 'primary' },
            { text: 'Book a Table', url: 'tel:2075550149', variant: 'secondary' }
          ]
        })
      }
    });

    console.log('✓ Hero section updated with all features!');
  } catch (error) {
    console.error('Error updating hero section:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHeroSection();