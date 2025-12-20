require('dotenv').config()
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL)
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL length:', process.env.DATABASE_URL.length)
}
