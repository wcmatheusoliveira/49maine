import { prisma } from '../src/lib/prisma';

async function checkCTASection() {
  try {
    // Find all CTA sections
    const ctaSections = await prisma.section.findMany({
      where: { type: 'cta' }
    });

    console.log(`Found ${ctaSections.length} CTA section(s)`);

    ctaSections.forEach((section, index) => {
      console.log(`\nCTA Section ${index + 1}:`);
      console.log('ID:', section.id);
      console.log('Name:', section.name);
      console.log('Order:', section.order);
      console.log('Data:', section.data);

      // Parse and check for video background
      const data = JSON.parse(section.data || '{}');
      if (data.backgroundVideo) {
        console.log('⚠️ Found video background:', data.backgroundVideo);
      }
      if (data.backgroundImage) {
        console.log('⚠️ Found image background:', data.backgroundImage);
      }
    });
  } catch (error) {
    console.error('Error checking CTA sections:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCTASection();