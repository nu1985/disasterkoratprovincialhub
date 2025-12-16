import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShieldAlert, Activity, MapPin, Phone } from "lucide-react";
import { Globe } from "@/components/magicui/globe";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import prisma from "@/lib/prisma";

const features = [
  {
    Icon: Activity,
    name: "ติดตามสถานการณ์เรียลไทม์",
    description: "ติตตามสถานการณ์น้ำท่วมและภัยพิบัติตลอด 24 ชั่วโมง ทั่วจังหวัด",
    href: "#",
    cta: "เรียนรู้เพิ่มเติม",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] bg-blue-500/10 blur-[100px]" />
    ),
  },
  {
    Icon: ShieldAlert,
    name: "ตอบสนองรวดเร็ว",
    description: "เชื่อมต่อโดยตรงกับหน่วยงานในพื้นที่เพื่อการเข้าช่วยเหลือที่รวดเร็ว",
    href: "#",
    cta: "เรียนรู้เพิ่มเติม",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] bg-green-500/10 blur-[100px]" />
    ),
  },
  {
    Icon: Search,
    name: "ติดตามความโปร่งใส",
    description: "ติดตามสถานะการแจ้งเหตุของคุณตั้งแต่ต้นจนจบกระบวนการ",
    href: "#track",
    cta: "ติดตามสถานะ",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] bg-purple-500/10 blur-[100px]" />
    ),
  },
  {
    Icon: MapPin,
    name: "แผนที่โต้ตอบ",
    description: "แสดงภาพเหตุการณ์ภัยพิบัติบนแผนที่สด เพื่อการประเมินสถานการณ์ที่ดียิ่งขึ้น",
    href: "#",
    cta: "ดูแผนที่",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] bg-red-500/10 blur-[100px]" />
    ),
  },
];

export default async function Home() {


  const totalIncidents = await prisma.incident.count();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">ศูนย์ข้อมูลภัยพิบัติโคราช</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">หน้าแรก</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">แผนที่</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">สถิติ</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">ติดต่อ</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">สำหรับเจ้าหน้าที่</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex h-[800px] w-full flex-col items-center justify-center overflow-hidden bg-background">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-40 pointer-events-none">
            <Globe className="scale-100 translate-x-[25%] translate-y-32" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-100/50 backdrop-blur-sm text-red-600 mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              แจ้งเหตุรวม {totalIncidents} รายการ
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
              ศูนย์จัดการภัยพิบัติ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                จังหวัดนครราชสีมา
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              ระบบศูนย์กลางสำหรับการแจ้งเหตุและติดตามสถานการณ์ภัยพิบัติ เชื่อมโยงข้อมูล รวดเร็ว โปร่งใส
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/report">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-base">
                    แจ้งเหตุภัยพิบัติ
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="#track">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-slate-300 hover:bg-slate-50 text-slate-700 font-medium">
                  <Search className="mr-2 h-4 w-4" />
                  ติดตามสถานะ
                </Button>
              </Link>
            </div>
          </div>
        </section>



        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">ระบบบูรณาการความช่วยเหลือ</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                แพลตฟอร์มของเราเชื่อมโยงประชาชนกับหน่วยงานบรรเทาสาธารณภัยโดยตรง เพื่อการตอบสนองที่รวดเร็วที่สุด
              </p>
            </div>
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Tracking Section */}
        <section id="track" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-8">ติดตามสถานะการแจ้งเหตุ</h2>
              <Card className="shadow-xl border-slate-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">ตรวจสอบความคืบหน้า</CardTitle>
                  <CardDescription>กรอกหมายเลขรหัสเหตุการณ์ หรือ เบอร์โทรศัพท์</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Input placeholder="เช่น INC-2024-001 หรือ 0812345678" className="h-12 text-lg" />
                    <Button size="lg" className="px-8 bg-slate-900 hover:bg-slate-800 h-12">ค้นหา</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <span className="font-bold text-xl text-white">ศูนย์ข้อมูลภัยพิบัติโคราช</span>
              </div>
              <p className="max-w-xs text-sm">
                แพลตฟอร์มบริหารจัดการภัยพิบัติอย่างเป็นทางการ ขององค์การบริหารส่วนจังหวัดนครราชสีมา
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">แจ้งเหตุภัยพิบัติ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">ติดตามสถานะ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">ดูแผนที่</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">เบอร์โทรฉุกเฉิน</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ติดต่อ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 1567 (สายด่วน)</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 044-xxx-xxx (สำนักงาน)</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>© 2024 องค์การบริหารส่วนจังหวัดนครราชสีมา. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
