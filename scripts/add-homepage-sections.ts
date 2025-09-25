import { prisma } from '../src/lib/prisma';

async function addHomepageSections() {
  try {
    // Find the homepage
    const homepage = await prisma.page.findFirst({
      where: { isHomepage: true }
    });

    if (!homepage) {
      console.error('No homepage found! Please create a homepage first.');
      return;
    }

    console.log('Found homepage:', homepage.id);

    // Clear existing sections
    await prisma.section.deleteMany({
      where: { pageId: homepage.id }
    });

    // Add sections
    const sections = [
      {
        type: 'hero',
        name: 'Hero Section',
        order: 0,
        isVisible: true,
        data: JSON.stringify({
          headline: 'Come hungry, leave happy',
          subheadline: 'Wood-fired goodness in the heart of Lincoln, Maine',
          tagline: 'Open daily from 5PM',
          backgroundVideo: '/49maine-hero.mp4',
          overlayOpacity: 0.4,
          ctaButtons: [
            { text: 'View Menu', url: '#menu', variant: 'primary' },
            { text: 'Book a Table', url: '#reserve', variant: 'secondary' }
          ]
        }),
        pageId: homepage.id
      },
      {
        type: 'menu',
        name: 'Menu Display',
        order: 1,
        isVisible: true,
        data: JSON.stringify({
          title: 'Our Menu',
          subtitle: 'Fresh daily selections',
          showPrices: true,
          showDescriptions: true,
          layout: 'grid'
        }),
        pageId: homepage.id
      },
      {
        type: 'location',
        name: 'Location & Hours',
        order: 2,
        isVisible: true,
        data: JSON.stringify({
          title: 'Find Us',
          subtitle: 'We\'re easy to find',
          showMap: true,
          showHours: true
        }),
        pageId: homepage.id
      },
      {
        type: 'cta',
        name: 'Call to Action',
        order: 3,
        isVisible: true,
        data: JSON.stringify({
          title: 'Ready to Experience 49Maine?',
          subtitle: 'Call us to make a reservation',
          backgroundColor: '#144663',
          button: {
            text: 'Book Now',
            url: 'tel:2075550149'
          }
        }),
        pageId: homepage.id
      }
    ];

    for (const section of sections) {
      const created = await prisma.section.create({
        data: section
      });
      console.log('Created section:', created.name);
    }

    console.log('✓ Homepage sections added successfully!');
  } catch (error) {
    console.error('Error adding homepage sections:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addHomepageSections();