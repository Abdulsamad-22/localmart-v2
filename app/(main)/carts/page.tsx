import { PageTransition } from "@/src/components/ui/PageTranstion";
import CartItemSection from "./CartItemSection";

export default function CartPage() {
  return (
    <PageTransition>
      <CartItemSection />
    </PageTransition>
  );
}
