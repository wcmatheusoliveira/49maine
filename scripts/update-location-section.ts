import { prisma } from '../src/lib/prisma';

async function updateLocationSection() {
  try {
    // Find the location section
    const locationSection = await prisma.section.findFirst({
      where: { type: 'location' }
    });

    if (!locationSection) {
      console.error('No location section found!');
      return;
    }

    console.log('Found location section:', locationSection.id);

    // Update with the editable fields
    const updatedLocation = await prisma.section.update({
      where: { id: locationSection.id },
      data: {
        data: JSON.stringify({
          title: 'Come Find Us',
          subtitle: 'Worth the trip, easy to find',
          hoursTitle: 'Hours',
          contactTitle: 'Contact',
          directionsButtonText: 'Get Directions'
        })
      }
    });

    console.log('✓ Location section updated with editable fields!');
  } catch (error) {
    console.error('Error updating location section:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLocationSection();