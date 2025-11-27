console.log('Requiring Prisma Client...')
try {
    const { PrismaClient } = require('@prisma/client')
    console.log('Prisma Client required successfully.')
    const prisma = new PrismaClient()
    console.log('Prisma Client instantiated.')
} catch (e) {
    console.error('Failed:', e)
}
