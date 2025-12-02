import {Layout} from "@/components/layouts/layout";
import {ProductTable} from "@/features/product/components/product-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Produk",
          target: "/internal/produk",
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
             Produk
            </h2>
          </div>
        </div>
        <ProductTable />
      </section>
    </Layout>
  );
}
