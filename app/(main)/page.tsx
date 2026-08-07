import { LocationProvider } from "@/src/components/LocationProvider";
import StoreGrid from "@/src/components/storeGrid/StoreGrid";
import { getProducts } from "@/lib/products/getProducts";
import { SearchBar } from "@/src/components/search/SearchBar";

export default async function Home() {
  const result = await getProducts();

  if (!result.success) return <p>Failed to load products</p>;

  const products = result.data ?? [];
  return (
    <main>
      {/* <SearchBar /> */}
      <LocationProvider />
      <StoreGrid limit={12} products={products} />
    </main>
  );
}
