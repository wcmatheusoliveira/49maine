import { prisma } from './prisma'

export async function getMenuCategories() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: {
            isAvailable: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })
    return categories
  } catch (error) {
    console.error('Failed to fetch menu categories:', error)
    return []
  }
}

export async function getBusinessInfo() {
  try {
    const businessInfo = await prisma.businessInfo.findFirst()
    return businessInfo
  } catch (error) {
    console.error('Failed to fetch business info:', error)
    return null
  }
}

export async function getHomePage() {
  try {
    const page = await prisma.page.findFirst({
      where: {
        isHomepage: true,
        isPublished: true
      },
      include: {
        sections: {
          where: {
            isVisible: true
          },
          orderBy: { order: 'asc' },
          include: {
            components: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
    return page
  } catch (error) {
    console.error('Failed to fetch homepage:', error)
    return null
  }
}

export async function getNavigation() {
  try {
    const navItems = await prisma.navigation.findMany({
      where: {
        isVisible: true
      },
      orderBy: { order: 'asc' }
    })
    return navItems
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    return []
  }
}