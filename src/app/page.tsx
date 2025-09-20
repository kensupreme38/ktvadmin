'use client';

import { KtvCard } from '@/components/ktv/KtvCard';
import { allKtvs } from '@/data/ktvs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Music4, ShieldCheck, Utensils, Award, Waves, Wifi, CalendarClock, Armchair } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const featuredKtvs = allKtvs.slice(0, 3);

const newHighlights = [
    {
        icon: Waves,
        title: 'Dịch vụ chuyên nghiệp',
        description: 'Đội ngũ nhân viên tận tâm tại KARAOKE 57 TULIP KTV sẽ khiến bạn đến và không muốn rời đi.',
    },
    {
        icon: Wifi,
        title: 'Wi-Fi miễn phí',
        description: 'Wi-Fi miễn phí phủ sóng toàn bộ hệ thống, mang lại sự tiện lợi cho bạn!',
    },
    {
        icon: Armchair,
        title: 'Phòng ốc tiện nghi',
        description: 'Hệ thống phòng lớn và tiện lợi nhất với đầy đủ dịch vụ, có WC riêng trong phòng.',
    },
    {
        icon: CalendarClock,
        title: 'Đặt phòng miễn phí',
        description: 'Hỗ trợ khách hàng đặt bàn trước thuận tiện, chủ động trong mọi cuộc vui.',
    },
];


const highlights = [
    {
        icon: Music4,
        title: 'Âm thanh đỉnh cao',
        description: 'Trải nghiệm âm thanh trong trẻo cho một đêm hát karaoke tuyệt vời.',
    },
    {
        icon: ShieldCheck,
        title: 'Phòng VIP sang trọng',
        description: 'Các phòng riêng tư, độc quyền dành cho bạn và bạn bè.',
    },
    {
        icon: Utensils,
        title: 'Ẩm thực tuyệt vời',
        description: 'Đồ ăn nhẹ và đồ uống ngon miệng để bữa tiệc luôn sôi động.',
    },
    {
        icon: Award,
        title: 'Không khí tiệc tùng',
        description: 'Không gian sống động và tràn đầy năng lượng để bạn thỏa sức ca hát.',
    },
];

const RetroMicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C14.2091 15 16 13.2091 16 11V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V11C8 13.2091 9.79086 15 12 15Z" stroke="white" strokeWidth="1.5"/>
      <path d="M5 11H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 11H19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 22H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 22V19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 19H15C16.1046 19 17 18.1046 17 17V16C17 14.8954 16.1046 14 15 14H9C7.89543 14 7 14.8954 7 16V17C7 18.1046 7.89543 19 9 19Z" stroke="white" strokeWidth="1.5"/>
    </svg>
  );

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden -mt-14 pt-14">
        <Image
          src="https://hcmc-ktv.com/wp-content/uploads/2025/06/57-Tulip-KTV-1024x512.png"
          alt="Dàn karaoke với ánh đèn neon"
          fill
          className="object-cover brightness-[0.3]"
          data-ai-hint="dark karaoke room"
          priority
        />
        <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full">
            <div className="absolute top-1/4">
                <p className="text-lg md:text-xl font-semibold text-shadow-glow-subtle mb-4">SAIGON'S PREMIER LUXURY KARAOKE EXPERIENCE!</p>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider text-shadow-glow">
                    57 TULIP KTV
                </h1>
            </div>
            
            <RetroMicrophoneIcon className="w-24 h-24 md:w-32 md:h-32 opacity-50" />
            
        </div>
      </section>

      {/* Featured Venues Section */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Địa Điểm Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredKtvs.map((ktv) => (
              <KtvCard key={ktv.id} ktv={ktv} />
            ))}
          </div>
        </div>
      </section>

      {/* New Highlights Section from image */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <Button asChild variant="outline" className="mb-8">
                <Link href="/directory">Xem tất cả các quán Karaoke</Link>
            </Button>
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
                Karaoke 57 Tulip The Best KTV in Ho Chi Minh City
            </h2>
            <div className="flex justify-center my-4">
                <div className="w-24 h-1 bg-yellow-400" />
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
                Trang bị hệ thống phòng cháy chữa cháy tự động là giải pháp tối ưu cho sự an toàn của người và tài sản khi vui chơi tại KARAOKE 57 TULIP KTV. Chúng tôi sẵn sàng chi hơn 1 tỷ đồng để mang lại sự an toàn và niềm vui cho quý khách.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newHighlights.map((highlight) => (
                <Card key={highlight.title} className="bg-card text-card-foreground p-6 flex items-center gap-6 text-left rounded-lg">
                    <highlight.icon className="w-12 h-12 text-yellow-400 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400">{highlight.title}</h3>
                        <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Tại sao chọn Aura?
            </h2>
             <p className="text-lg text-muted-foreground mt-2">Nền tảng đáng tin cậy của bạn cho cuộc sống về đêm tại Sài Gòn.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="bg-card/50 text-center p-6 flex flex-col items-center transition-all duration-300 hover:bg-primary/10 card-glow">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 shadow-lg shadow-primary/20">
                    <highlight.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground flex-grow">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
       <section className="py-20 text-center bg-gradient-to-t from-background to-card/30">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn Sàng Tỏa Sáng?</h2>
             <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Duyệt qua danh bạ đầy đủ của chúng tôi để khám phá KTV yêu thích tiếp theo của bạn. Cuộc phiêu lưu đang chờ đón.</p>
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                <Link href="/directory">Khám Phá Tất Cả KTV</Link>
            </Button>
         </div>
       </section>
    </div>
  );
}
