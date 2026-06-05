"use client";
import { useState } from "react";
import { BookOpen, Heart, AlertTriangle, Leaf, Users, Lightbulb } from "lucide-react";
import { normalizeImageUrl, getCategoryFallbackGradient } from "@/lib/images";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  education:   BookOpen,
  healthcare:  Heart,
  disaster:    AlertTriangle,
  environment: Leaf,
  community:   Users,
  general:     Lightbulb,
};

interface CampaignImageProps {
  imageUrl?: string | null;
  title?: string;
  category?: string;
  className?: string;
  imgClassName?: string;
  overlay?: React.ReactNode;
}

export function CampaignImage({
  imageUrl,
  title = "Campaign",
  category = "general",
  className = "relative overflow-hidden h-48",
  imgClassName = "w-full h-full object-cover",
  overlay,
}: CampaignImageProps) {
  const [failed, setFailed] = useState(false);
  const src = normalizeImageUrl(imageUrl);
  const showFallback = !src || failed;
  const CategoryIcon = CATEGORY_ICONS[category] ?? Lightbulb;
  const gradient = getCategoryFallbackGradient(category);

  if (showFallback) {
    return (
      <div className={`${className} bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <CategoryIcon size={48} className="text-white/80 drop-shadow" />
        {overlay}
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={title}
        className={imgClassName}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {overlay}
    </div>
  );
}
