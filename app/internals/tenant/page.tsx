import {Layout} from "@/components/layouts/layout";
import {TenantTable} from "@/features/tenant/components/tenant-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Tenant/Merchant",
          target: "/internal/tenant",
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Tenant / Merchant
            </h2>
          </div>
        </div>
        <TenantTable />
      </section>
    </Layout>
  );
}
