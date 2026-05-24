import React, { useEffect, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
    title: "Summer Sale",
    subtitle: "Up to 50% off on selected items",
    bg: "from-orange-500/60 to-transparent",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
    title: "New Arrivals",
    subtitle: "Discover the latest trends",
    bg: "from-purple-600/60 to-transparent",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
    title: "Free Shipping",
    subtitle: "On all orders above $50",
    bg: "from-blue-600/60 to-transparent",
  },
];

const BannerSlider = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => api.scrollNext(), 3500);
    return () => clearInterval(timer);
  }, [api]);

  return (
    <div className="relative mb-6 rounded-xl overflow-hidden">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-48 sm:h-64 md:h-72 w-full">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} flex flex-col justify-center px-8`}>
                  <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow">{banner.title}</h2>
                  <p className="text-white/90 text-sm sm:text-base mt-1 drop-shadow">{banner.subtitle}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-5 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
