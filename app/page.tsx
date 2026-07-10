import { LocationProvider } from "@/src/components/LocationProvider";
import SearchBar from "@/src/components/search/SearchBar";
import StoreFront from "@/src/components/storeFront/StoreFront";
import { getProducts } from "@/lib/products/getProducts";

export default async function Home() {
  const result = await getProducts();

  if (!result.success) return <p>Failed to load products</p>;

  const products = result.data ?? [];
  return (
    <main>
      <SearchBar />
      {/* <LocationProvider /> */}
      <StoreFront limit={12} products={products} />
    </main>
  );
}
