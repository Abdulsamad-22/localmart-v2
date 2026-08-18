import { LocationProvider } from "@/src/components/LocationProvider";
import StoreGrid from "@/src/components/storeGrid/StoreGrid";
import { getProducts } from "@/lib/products/getProducts";
import { PageTransition } from "@/src/components/ui/PageTranstion";
import { ProductFetchError } from "@/src/components/storeGrid/ProductFetchError";

export default async function Home() {
  const result = await getProducts();

  if (!result.success) return <ProductFetchError />;

  const products = result.data ?? [];
  return (
    <main>
      <PageTransition>
        <LocationProvider />
        <StoreGrid limit={12} products={products} />
      </PageTransition>
    </main>
  );
}
