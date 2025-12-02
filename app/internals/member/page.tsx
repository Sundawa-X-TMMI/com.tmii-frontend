import {Layout} from "@/components/layouts/layout";
import {UserTable} from "@/features/user/components/user-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Manajemen Member",
          target: "/internal/users",
        },
      ]}
    >
      <section className="flex flex-1 flex-col gap-4 space-y-8 overflow-hidden p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Member
            </h2>
          </div>
        </div>
        <UserTable />
      </section>
    </Layout>
  );
}
