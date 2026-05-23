import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const collegesData = [
  {
    name: "IIT Bombay",
    location: "Mumbai", state: "Maharashtra",
    fees: 250000, rating: 4.8, type: "Engineering",
    overview: "Indian Institute of Technology Bombay is a premier engineering institute known for cutting-edge research, world-class faculty, and exceptional placements. Established in 1958, it consistently ranks among the top institutions globally.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 250000 },
      { name: "B.Tech Electrical Engineering", duration: "4 years", fees: 250000 },
      { name: "M.Tech AI & Data Science", duration: "2 years", fees: 150000 },
    ],
    placement: { avgPackage: 2000000, highestPackage: 15000000, placementRate: 95, topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs"] },
    reviews: [
      { rating: 5, comment: "Best institute in India! World class faculty and research opportunities.", author: "Rahul Sharma" },
      { rating: 4.8, comment: "Amazing campus life and excellent placement support.", author: "Priya Nair" }
    ]
  },
  {
    name: "BITS Pilani",
    location: "Pilani", state: "Rajasthan",
    fees: 500000, rating: 4.6, type: "Engineering",
    overview: "Birla Institute of Technology and Science is a top private engineering college with excellent industry connections, a unique dual-degree program, and a vibrant campus culture.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 500000 },
      { name: "B.Tech Mechanical Engineering", duration: "4 years", fees: 480000 },
      { name: "B.Tech Electronics", duration: "4 years", fees: 490000 },
    ],
    placement: { avgPackage: 1800000, highestPackage: 12000000, placementRate: 92, topRecruiters: ["Flipkart", "Goldman Sachs", "DE Shaw", "Uber"] },
    reviews: [
      { rating: 4.5, comment: "Great campus and faculty. BITS Practice School is a unique advantage.", author: "Ankit Gupta" },
      { rating: 4.7, comment: "Excellent peer learning environment.", author: "Divya Menon" }
    ]
  },
  {
    name: "NIT Warangal",
    location: "Warangal", state: "Telangana",
    fees: 150000, rating: 4.4, type: "Engineering",
    overview: "National Institute of Technology Warangal is one of the top NITs in India with a strong alumni network, affordable fees, and excellent placement record across multiple disciplines.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 150000 },
      { name: "B.Tech Civil Engineering", duration: "4 years", fees: 140000 },
      { name: "B.Tech Mechanical Engineering", duration: "4 years", fees: 145000 },
    ],
    placement: { avgPackage: 1200000, highestPackage: 8000000, placementRate: 88, topRecruiters: ["TCS", "Infosys", "Wipro", "Deloitte"] },
    reviews: [
      { rating: 4, comment: "Affordable and quality education. Strong alumni network.", author: "Suresh Reddy" },
      { rating: 4.5, comment: "Great faculty and hostel life.", author: "Meera Iyer" }
    ]
  },
  {
    name: "VIT Vellore",
    location: "Vellore", state: "Tamil Nadu",
    fees: 350000, rating: 4.2, type: "Engineering",
    overview: "Vellore Institute of Technology is a private university known for its diverse student community, modern infrastructure, strong industry connections, and consistent placement performance.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 350000 },
      { name: "B.Tech AI & Machine Learning", duration: "4 years", fees: 380000 },
      { name: "B.Tech Biotechnology", duration: "4 years", fees: 320000 },
    ],
    placement: { avgPackage: 900000, highestPackage: 5000000, placementRate: 85, topRecruiters: ["Cognizant", "HCL", "Tech Mahindra", "Zoho"] },
    reviews: [
      { rating: 4, comment: "Good infrastructure and placements. Very diverse student body.", author: "Karthik S" },
      { rating: 4.2, comment: "Great sports and cultural activities.", author: "Sneha Pillai" }
    ]
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai", state: "Tamil Nadu",
    fees: 300000, rating: 4.0, type: "Engineering",
    overview: "SRM Institute is a large private university with modern facilities, active research programs, and a broad curriculum offering covering engineering, medicine, and management disciplines.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 300000 },
      { name: "B.Tech Data Science", duration: "4 years", fees: 320000 },
      { name: "MBA", duration: "2 years", fees: 250000 },
    ],
    placement: { avgPackage: 700000, highestPackage: 4000000, placementRate: 80, topRecruiters: ["Accenture", "Capgemini", "IBM", "Wipro"] },
    reviews: [
      { rating: 3.8, comment: "Decent college for engineering. Good campus facilities.", author: "Vikram T" },
      { rating: 4.1, comment: "Active placement cell and good faculty.", author: "Lakshmi R" }
    ]
  },
  {
    name: "IIT Delhi",
    location: "New Delhi", state: "Delhi",
    fees: 220000, rating: 4.9, type: "Engineering",
    overview: "IIT Delhi is one of India's most prestigious engineering institutions, situated in the capital. Known for its research output, global collaborations, and exceptional alumni in tech and entrepreneurship.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 220000 },
      { name: "B.Tech Aerospace Engineering", duration: "4 years", fees: 220000 },
      { name: "M.Tech VLSI Design", duration: "2 years", fees: 130000 },
    ],
    placement: { avgPackage: 2200000, highestPackage: 18000000, placementRate: 97, topRecruiters: ["Google", "Apple", "Meta", "McKinsey"] },
    reviews: [
      { rating: 5, comment: "Unmatched research environment and industry exposure.", author: "Arjun Kapoor" },
      { rating: 4.9, comment: "Top faculty and global opportunities.", author: "Neha Joshi" }
    ]
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal", state: "Karnataka",
    fees: 420000, rating: 4.1, type: "Engineering",
    overview: "MIT Manipal is a well-known private engineering college with strong international connections, a vibrant campus, and diverse program offerings across multiple disciplines.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 420000 },
      { name: "B.Tech Information Technology", duration: "4 years", fees: 410000 },
      { name: "B.Tech Mechatronics", duration: "4 years", fees: 400000 },
    ],
    placement: { avgPackage: 800000, highestPackage: 4500000, placementRate: 82, topRecruiters: ["Infosys", "Tata Motors", "L&T", "Bosch"] },
    reviews: [
      { rating: 4.0, comment: "Beautiful campus and international exposure.", author: "Rohan Bhat" },
      { rating: 4.2, comment: "Great extracurriculars and decent placements.", author: "Ananya Shetty" }
    ]
  },
  {
    name: "IIIT Hyderabad",
    location: "Hyderabad", state: "Telangana",
    fees: 280000, rating: 4.5, type: "Engineering",
    overview: "IIIT Hyderabad is a top research-focused institute specializing in computer science and information technology, with strong industry ties and cutting-edge research in AI, NLP, and computer vision.",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", fees: 280000 },
      { name: "B.Tech Electronics & Communication", duration: "4 years", fees: 270000 },
      { name: "M.S. by Research", duration: "2 years", fees: 180000 },
    ],
    placement: { avgPackage: 1600000, highestPackage: 10000000, placementRate: 94, topRecruiters: ["Microsoft", "Google", "Amazon", "Qualcomm"] },
    reviews: [
      { rating: 4.5, comment: "Best CS research institute. Strong focus on fundamentals.", author: "Sai Teja" },
      { rating: 4.6, comment: "Excellent faculty and research opportunities in AI.", author: "Pooja Desai" }
    ]
  },
]

async function main() {
  console.log('Seeding database...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    }
  })

  // Clear existing colleges
  await prisma.savedCollege.deleteMany()
  await prisma.review.deleteMany()
  await prisma.placement.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  for (const c of collegesData) {
    const college = await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        state: c.state,
        fees: c.fees,
        rating: c.rating,
        type: c.type,
        overview: c.overview,
        courses: { create: c.courses },
        placements: { create: c.placement },
        reviews: { create: c.reviews },
      }
    })
    console.log(`✅ Created: ${college.name}`)
  }

  console.log('✅ Database seeded successfully!')
  console.log('Test login: test@example.com / password123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
