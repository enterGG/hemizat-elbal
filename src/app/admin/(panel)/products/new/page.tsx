import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">NEW PIECE</p>
        <h1 className="mt-2 text-4xl font-extrabold">زيد قطعة جديدة</h1>
      </div>
      <ProductForm />
    </div>
  );
}
