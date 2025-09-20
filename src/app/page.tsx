'use client';

import { KtvCard } from '@/components/ktv/KtvCard';
import { allKtvs } from '@/data/ktvs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Music4, ShieldCheck, Utensils, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const featuredKtvs = allKtvs.slice(0, 3);

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

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/seed/301/1800/1200"
          alt="Dàn karaoke với ánh đèn neon"
          fill
          className="object-cover brightness-50"
          data-ai-hint="neon karaoke"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-bold text-shadow-glow">
            Tìm Sân Khấu Của Bạn
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 text-shadow-glow-subtle">
            Khám phá những địa điểm KTV tốt nhất tại Thành phố Hồ Chí Minh.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
             <Link href="#featured">Tìm KTV Cho Tối Nay</Link>
          </Button>
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
