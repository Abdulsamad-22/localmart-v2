import { ProductCard } from "../ProductCard";
import { ProductsWithVendor } from "@/types/product";

type Props = {
  products: ProductsWithVendor[];
  limit: number;
};
export default function StoreGrid({ limit, products }: Props) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-6 md:gap-y-12 px-4 md:px-12 my-12">
      {products.slice(0, limit).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
