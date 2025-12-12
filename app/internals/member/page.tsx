import {Layout} from "@/components/layouts/layout";
import {MemberTable} from "@/features/member/components/member-table";

export default function Page() {
  return (
    <Layout
      breadcrumbs={[
        {
          name: "Manajemen Member",
          target: "/internal/members",
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
        <MemberTable />
      </section>
    </Layout>
  );
}
