import ProductColorOption from "./ProductColorOption";
import ProductSizesOption from "./ProductSizesOption";

export default function ProductVaraiant() {
  return (
    <>
      <h3 className="text-[1.125rem] mb-2">Variant</h3>
      <ProductSizesOption />
      <ProductColorOption />
    </>
  );
}
