import {
  Armchair,
  Baby,
  Barbell,
  BookOpenText,
  DeviceMobile,
  DeviceMobileCamera,
  Heartbeat,
  PaintBrush,
  Plant,
  ShirtFolded,
  ShoppingBag,
  Sparkle,
  SquaresFour,
  Tag,
} from "@phosphor-icons/react";

import { IconProps } from "@phosphor-icons/react";

export const CategoryIcons: Record<string, React.ComponentType<IconProps>> = {
  "All Categories": Tag,

  "Fashion & Clothing": ShirtFolded,

  "Food & Groceries": ShoppingBag,

  Electronics: DeviceMobile,

  "Beauty & Personal Care": Sparkle,

  "Home & Furniture": Armchair,

  "Health & Wellness": Heartbeat,

  "Sports & Fitness": Barbell,

  "Books & Stationery": BookOpenText,

  "Baby & Kids": Baby,

  "Phones & Accessories": DeviceMobileCamera,

  "Agriculture & Farm Produce": Plant,

  "Art & Crafts": PaintBrush,

  Others: SquaresFour,
};
