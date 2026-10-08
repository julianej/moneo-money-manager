import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Briefcase,
  Heart,
  Plane,
  Coffee,
  FolderCode,
  Smartphone,
  CircleDollarSign,
  Tag,
  GraduationCap,
} from "lucide-react";



export function getCategoryIcon(category) {
  const name = category.toLowerCase();

  if (name.includes("food") || name.includes("restaurant")) {
    return <Utensils size={16} />;
  }

  if (name.includes("shopping")) {
    return <ShoppingBag size={16} />;
  }

  if (name.includes("education")) {
    return <GraduationCap size={16} />;
  }

  if (
    name.includes("transport") ||
    name.includes("car") ||
    name.includes("bvg")
  ) {
    return <Car size={16} />;
  }

  if (name.includes("home") || name.includes("rent")) {
    return <Home size={16} />;
  }

  if (
    name.includes("salary") ||
    name.includes("job") ||
    name.includes("work")
  ) {
    return <Briefcase size={16} />;
  }

  if (name.includes("travel") || name.includes("flight")) {
    return <Plane size={16} />;
  }

  if (name.includes("coffee")) {
    return <Coffee size={16} />;
  }

  if (name.includes("health")) {
    return <Heart size={16} />;
  }

  if (
    name.includes("phone") ||
    name.includes("mobile")
  ) {
    return <Smartphone size={16} />;
  }

  if (
    name.includes("money") ||
    name.includes("income") ||
    name.includes("expense")
  ) {
    return <CircleDollarSign size={16} />;
  }
    if (
    name.includes("software") ||
    name.includes("office") ||
    name.includes("expense")
  ) {
    return <FolderCode size={16} />;
  }

  return <Tag size={16} />;
}