import {Layout} from "@/components/layouts/layout";
import {UserTable} from "@/features/user/components/user-table";
import {WahanaTable} from "@/features/wahana/components/wahana-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Wahana x Museum",
          target: "/internal/wahana",
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Wahana x Museum
            </h2>
          </div>
        </div>
        <WahanaTable />
      </section>
    </Layout>
  );
}
