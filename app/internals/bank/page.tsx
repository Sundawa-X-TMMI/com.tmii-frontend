import {Layout} from "@/components/layouts/layout";
import {BankTable} from "@/features/bank/components/bank-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Akun Bank",
          target: "/internal/bank",
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Akun Bank
            </h2>
          </div>
        </div>
        <BankTable />
      </section>
    </Layout>
  );
}
