import { Layout } from "@/components/layouts/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Building2,
  Ticket,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function DashboardPage() {
  return (
    <Layout breadcrumbs={[{ name: "Dashboard", target: "/dashboard" }]}>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard TMII</h2>
            <p className="text-muted-foreground">
              Selamat datang kembali! Berikut ringkatan hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* 4 Card Utama */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengunjung Hari Ini</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.845</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                <span className="text-green-600">+8.2%</span> dari kemarin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenant Aktif</CardTitle>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                dari total 256 tenant terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 284.5 Jt</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                <span className="text-green-600">+12.5%</span> dari kemarin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
              <Ticket className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9.234</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
                <span className="text-red-600">-3.1%</span> dari kemarin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grafik + Tenant Teratas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Grafik Pendapatan (bisa ganti dengan chart real nanti) */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Pendapatan 7 Hari Terakhir</CardTitle>
              <CardDescription>Total Rp 1.89 Miliar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 78, 90, 81, 56, 95, 88].map((val, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                      style={{ height: `${val}%` }}
                    />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">
                      Rp {val * 2.8}Jt
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tenant dengan Pendapatan Tertinggi */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top 5 Tenant</CardTitle>
              <CardDescription>Berdasarkan pendapatan hari ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "SnowBay Waterpark", revenue: "Rp 68.2Jt", logo: "/images/snowbay.png" },
                { name: "Kereta Gantung", revenue: "Rp 42.1Jt", logo: "" },
                { name: "Taman Burung", revenue: "Rp 35.7Jt", logo: "" },
                { name: "Pasar Nusantara", revenue: "Rp 28.9Jt", logo: "" },
                { name: "Dunia Air Tawar", revenue: "Rp 22.4Jt", logo: "" },
              ].map((tenant, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-lg text-primary">#{i + 1}</div>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={tenant.logo} />
                      <AvatarFallback>{tenant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{tenant.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{tenant.revenue}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Lihat Laporan Bulanan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Tambah Tenant Baru
              </Button>
              <Button className="w-full">
                Export Data Hari Ini
              </Button>
            </CardContent>
          </Card>

          {/* Kalender Event atau Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div>
                    <p className="font-medium">Hari Kemerdekaan RI</p>
                    <p className="text-sm text-muted-foreground">17 Agustus 2025</p>
                  </div>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Libur Nasional</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">Pementasan Wayang Kulit</p>
                    <p className="text-sm text-muted-foreground">20 Agustus 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
}