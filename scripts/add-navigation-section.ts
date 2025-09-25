import { prisma } from '../src/lib/prisma';

async function addNavigationSection() {
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

    // Update all existing sections to increase their order by 1
    await prisma.section.updateMany({
      where: { pageId: homepage.id },
      data: { order: { increment: 1 } }
    });

    // Add navigation section at order 0
    const navigationSection = await prisma.section.create({
      data: {
        type: 'navigation',
        name: 'Navigation Header',
        order: 0,
        isVisible: true,
        data: JSON.stringify({
          logo: './logo.svg',
          navItems: [
            { name: 'Menu', to: 'menu' },
            { name: 'Hours & Location', to: 'location' },
            { name: 'Reserve', to: 'reserve' }
          ],
          showCallButton: true,
          callButtonText: 'Call Now',
          backgroundColor: '#FBF8EB',
          textColor: '#144663',
          sticky: true
        }),
        pageId: homepage.id
      }
    });

    console.log('Created navigation section:', navigationSection.name);
    console.log('✓ Navigation section added successfully!');
  } catch (error) {
    console.error('Error adding navigation section:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addNavigationSection();