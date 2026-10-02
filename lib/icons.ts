import {
  Award,
  Camera,
  Compass,
  Flame,
  Heart,
  Leaf,
  type LucideIcon,
  Map,
  Mountain,
  Shield,
  Sun,
  Tent,
  Users,
  Utensils,
} from 'lucide-react';

// Icons selectable from the CMS for feature/value lists.
export const ICONS: Record<string, LucideIcon> = {
  shield: Shield,
  users: Users,
  leaf: Leaf,
  utensils: Utensils,
  heart: Heart,
  compass: Compass,
  mountain: Mountain,
  tent: Tent,
  award: Award,
  map: Map,
  sun: Sun,
  camera: Camera,
  flame: Flame,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export const getIcon = (name: string): LucideIcon => ICONS[name] ?? Compass;
