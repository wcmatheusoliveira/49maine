import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { menuData, specialOffers, testimonials } from '../src/data/menu'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.component.deleteMany()
  await prisma.section.deleteMany()
  await prisma.page.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menuCategory.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.specialOffer.deleteMany()
  await prisma.businessInfo.deleteMany()
  await prisma.site.deleteMany()
  await prisma.navigation.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminEmail = 'admin@49maine.com'
  const adminPassword = 'admin123' // Change this in production!

  const hashedPassword = await hash(adminPassword, 12)

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: '49Maine Admin',
      role: 'admin',
    },
  })

  console.log('✅ Created admin user:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
  console.log('   ⚠️  IMPORTANT: Change this password after first login!')

  // Create site configuration
  const site = await prisma.site.create({
    data: {
      name: '49Maine',
      logo: '/logo.svg',
      primaryColor: '#144663',
      secondaryColor: '#FBF8EB',
      accentColor: '#fbbf24'
    }
  })

  console.log('Created site configuration')

  // Create business info
  const businessInfo = await prisma.businessInfo.create({
    data: {
      name: '49Maine',
      address: '49 Main St',
      city: 'Lincoln',
      state: 'Maine',
      zip: '04457',
      phone: '(207) 555-0149',
      email: 'hello@49maine.com',
      hours: JSON.stringify({
        'Tuesday - Thursday': '5:00 PM - 9:00 PM',
        'Friday - Saturday': '5:00 PM - 10:00 PM',
        'Sunday': '4:00 PM - 8:00 PM',
        'Monday': 'Closed'
      }),
      socialMedia: JSON.stringify({
        instagram: 'https://instagram.com/49maine',
        facebook: 'https://facebook.com/49maine'
      }),
      mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.6847391089!2d-68.61259!3d45.36215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ca5f5f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2s49%20Main%20St%2C%20Lincoln%2C%20ME%2004457!5e0!3m2!1sen!2sus!4v1234567890" width="100%" height="100%" style="border:0; min-height: 500px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    }
  })

  console.log('Created business info')

  // Create navigation items
  const navItems = [
    { label: 'Menu', url: '#menu', order: 0 },
    { label: 'Hours & Location', url: '#location', order: 1 },
    { label: 'Reserve', url: '#reserve', order: 2 }
  ]

  for (const item of navItems) {
    await prisma.navigation.create({ data: item })
  }

  console.log('Created navigation items')

  // Create homepage
  const homepage = await prisma.page.create({
    data: {
      slug: 'home',
      title: '49Maine - Wood-fired goodness in Lincoln, Maine',
      description: 'Quality meats, fresh seafood, handmade pastas, and wood-fired pizzas in the heart of Lincoln, Maine',
      isPublished: true,
      isHomepage: true,
      seoTitle: '49Maine Restaurant | Lincoln, Maine',
      seoDescription: 'Experience wood-fired pizzas, fresh seafood, and quality meats at 49Maine in Lincoln. Local ingredients, crafted with care.'
    }
  })

  console.log('Created homepage')

  // Create homepage sections
  const heroSection = await prisma.section.create({
    data: {
      type: 'hero',
      name: 'Hero Section',
      order: 0,
      isVisible: true,
      pageId: homepage.id,
      data: JSON.stringify({
        headline: 'Come hungry, <span class="md:text-8xl text-7xl" style="color: #FFF; font-family: \\"adventures-unlimited\\", serif">leave happy</span>',
        tagline: 'Wood-fired goodness in the heart of Lincoln, Maine',
        specialAnnouncement: "Tonight's Special: Half-Price Wings After 8PM",
        ctaButtons: [
          { text: 'See Menu & Order', url: '#menu', variant: 'primary' },
          { text: 'Book a Table', url: 'tel:2075550149', variant: 'secondary' }
        ],
        backgroundVideo: '/49maine-hero.mp4',
        overlayOpacity: 0.4
      })
    }
  })

  const menuSection = await prisma.section.create({
    data: {
      type: 'menu',
      name: 'Menu Section',
      order: 1,
      isVisible: true,
      pageId: homepage.id,
      data: JSON.stringify({
        title: 'The Good Stuff',
        subtitle: 'Wood-fired, fresh-made, and always worth it'
      })
    }
  })

  const locationSection = await prisma.section.create({
    data: {
      type: 'location',
      name: 'Location & Hours',
      order: 2,
      isVisible: true,
      pageId: homepage.id,
      data: JSON.stringify({
        title: 'Come Find Us',
        subtitle: 'Worth the trip, easy to find'
      })
    }
  })

  const ctaSection = await prisma.section.create({
    data: {
      type: 'cta',
      name: 'Bottom CTA',
      order: 3,
      isVisible: true,
      pageId: homepage.id,
      data: JSON.stringify({
        logo: '/logo.svg',
        title: 'Ready to Experience 49Maine?',
        subtitle: 'Call us to make a reservation',
        backgroundColor: '#144663',
        button: {
          text: '(207) 555-0149',
          url: 'tel:2075550149',
          icon: '📞'
        }
      })
    }
  })

  console.log('Created page sections')

  // Create menu categories and items
  for (let categoryIndex = 0; categoryIndex < menuData.length; categoryIndex++) {
    const categoryData = menuData[categoryIndex]

    const category = await prisma.menuCategory.create({
      data: {
        name: categoryData.title,
        order: categoryIndex,
        isActive: true
      }
    })

    // Create menu items for this category
    for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
      const item = categoryData.items[itemIndex]

      const popularItems = [
        '49 Smash Burger',
        'NY Strip Steak (Wagyu)',
        'Wood-Fired Chicken Wings',
        'Scallop Risotto',
        'Margherita'
      ]

      let priceOptions = null
      let price = null

      if (typeof item.price === 'string') {
        price = item.price
      } else if (item.price) {
        if (item.price.small && item.price.large) {
          priceOptions = JSON.stringify({
            Small: item.price.small,
            Large: item.price.large
          })
        } else if (item.price.options) {
          const optionsObj: any = {}
          item.price.options.forEach(opt => {
            const [key, val] = opt.split(' ')
            optionsObj[key] = val
          })
          priceOptions = JSON.stringify(optionsObj)
        }
      }

      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: price,
          priceOptions: priceOptions,
          isPopular: popularItems.includes(item.name),
          isAvailable: true,
          order: itemIndex,
          categoryId: category.id
        }
      })
    }
  }

  console.log('Created menu categories and items')

  // Create testimonials
  for (let i = 0; i < testimonials.length; i++) {
    const testimonial = testimonials[i]
    await prisma.testimonial.create({
      data: {
        name: testimonial.name,
        rating: testimonial.rating,
        text: testimonial.text,
        date: testimonial.date,
        isPublished: true,
        order: i
      }
    })
  }

  console.log('Created testimonials')

  // Create special offers
  for (let i = 0; i < specialOffers.length; i++) {
    const offer = specialOffers[i]
    await prisma.specialOffer.create({
      data: {
        title: offer.title,
        description: offer.description,
        icon: offer.icon,
        isActive: true,
        order: i
      }
    })
  }

  console.log('Created special offers')

  console.log('Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })