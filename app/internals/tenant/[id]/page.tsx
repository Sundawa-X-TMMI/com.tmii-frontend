"use client";

import {Layout} from "@/components/layouts/layout";
import {MerchantProductTable} from "@/features/product/components/merchant-product-table";
import {useParams, useRouter} from "next/navigation";
import {useTenant} from "@/features/tenant/hooks/tenant-queries";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useMemo} from "react";
import {TenantTypes} from "@/types/features/tenant.type";
import {Query} from "@/types/lib/query.type";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  // Fetch tenant data
  const {data: tenantData, isLoading} = useTenant({
    page: 1,
    itemPerPage: 100,
    sortBy: "createdAt",
    direction: "DESC",
    search: "",
  });

  // ✅ GUNAKAN useMemo BUKAN useState + useEffect
  const tenantName = useMemo(() => {
    if (!tenantData?.data) return "";

    const tenants = (tenantData.data as Query.Pagination<TenantTypes.Service.TenantData>)?.items || [];
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant?.name || "";
  }, [tenantData, tenantId]);

  // Loading state
  if (isLoading) {
    return (
      <Layout
        breadcrumbs={[
          {
            name: "Tenant",
            target: "/internals/tenant",
          },
          {
            name: "Loading...",
            target: `/internals/tenant/${tenantId}`,
          },
        ]}
      >
        <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      breadcrumbs={[
        {
          name: "Tenant",
          target: "/internals/tenant",
        },
        {
          name: tenantName || "Detail",
          target: `/internals/tenant/${tenantId}`,
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/internals/tenant")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Produk - {tenantName || "Loading..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              Kelola produk untuk tenant ini
            </p>
          </div>
        </div>
        <MerchantProductTable merchantId={tenantId} merchantName={tenantName} />
      </section>
    </Layout>
  );
}