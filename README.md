# ระบบจัดการภัยพิบัติ (องค์การบริหารส่วนจังหวัดนครราชสีมา)

แพลตฟอร์มบนเว็บแบบครบวงจรสำหรับการจัดการเหตุภัยพิบัติ ทรัพยากร และการมอบหมายงาน สำหรับองค์การบริหารส่วนจังหวัดนครราชสีมา

## คุณสมบัติ

-   **การรายงานเหตุ**: รายงานและติดตามภัยพิบัติประเภทต่างๆ (น้ำท่วม, ไฟไหม้, ฯลฯ)
-   **แดชบอร์ดแบบเรียลไทม์**: ติดตามสถานการณ์และสถิติแบบสดๆ
-   **การจัดการทรัพยากร**: ติดตามยานพาหนะ อุปกรณ์ และบุคลากร
-   **ระบบมอบหมายงาน**: สั่งการทรัพยากรไปยังจุดเกิดเหตุ
-   **แผนที่**: แสดงตำแหน่งเหตุการณ์บนแผนที่แบบโต้ตอบ
-   **การจัดการผู้ใช้**: ควบคุมการเข้าถึงตามบทบาท (ผู้ดูแลระบบ, เจ้าหน้าที่, ฯลฯ)
-   **รองรับสองภาษา**: ใช้งานได้ทั้งภาษาไทยและภาษาอังกฤษ

## เทคโนโลยีที่ใช้

-   **Framework**: Next.js 14 (App Router)
-   **Database**: PostgreSQL พร้อม Prisma ORM
-   **Authentication**: NextAuth.js
-   **UI Library**: shadcn/ui + Tailwind CSS
-   **Maps**: Leaflet / React-Leaflet

## การเริ่มต้นใช้งาน

### สิ่งที่ต้องมี

-   Node.js 18+
-   PostgreSQL Database

### การติดตั้ง

1.  Clone repository:
    ```bash
    git clone https://github.com/your-repo/disaster-management-system.git
    cd disaster-management-system
    ```

2.  ติดตั้ง dependencies:
    ```bash
    npm install
    ```

3.  ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables):
    -   คัดลอกไฟล์ `.env.example` ไปเป็น `.env`
    -   แก้ไข `DATABASE_URL` และ `NEXTAUTH_SECRET`

4.  เริ่มต้นฐานข้อมูล:
    ```bash
    npx prisma migrate dev
    npm run seed
    ```

5.  รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server):
    ```bash
    npm run dev
    ```

6.  เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์ของคุณ

## การนำไปใช้งานจริง (Deployment)

### การติดตั้งแบบมาตรฐาน

1.  Build โปรเจกต์:
    ```bash
    npm run build
    ```

2.  เริ่มเซิร์ฟเวอร์ Production:
    ```bash
    npm start
    ```

### การติดตั้งด้วย Docker (แนะนำ)

1.  ตรวจสอบว่าติดตั้ง Docker และ Docker Compose แล้ว

2.  สร้างและเริ่ม Container:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

3.  แอปพลิเคชันจะใช้งานได้ที่ [http://localhost:3000](http://localhost:3000)

4.  หากต้องการหยุด Container:
    ```bash
    docker-compose -f docker-compose.prod.yml down
    ```

## ลิขสิทธิ์

โปรเจกต์นี้อยู่ภายใต้สัญญาอนุญาต MIT License