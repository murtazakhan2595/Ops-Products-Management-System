import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, AlertTriangle, TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useStats } from '../hooks/useStats';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

const STATUS_COLORS = {
  Active: '#10b981',
  Draft: '#f59e0b',
  Archived: '#6b7280',
};

const BAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color: 'blue' | 'green' | 'orange' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-200',
    purple: 'bg-violet-500/10 text-violet-600 border-violet-200',
  };

  const iconBg = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    purple: 'bg-violet-500',
  };

  return (
    <Card className={`${colorClasses[color]} border-2 transition-all hover:shadow-lg hover:scale-[1.02]`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`${iconBg[color]} p-3 rounded-xl shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] bg-gray-100 rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px] bg-gray-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 shadow-lg rounded-lg border">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600 font-bold">{payload[0].value} products</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: statsData, isLoading } = useStats();
  const stats = statsData?.data;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const statusData = [
    { name: 'Active', value: stats?.activeProducts || 0, color: STATUS_COLORS.Active },
    { name: 'Draft', value: stats?.draftProducts || 0, color: STATUS_COLORS.Draft },
    { name: 'Archived', value: stats?.archivedProducts || 0, color: STATUS_COLORS.Archived },
  ].filter((d) => d.value > 0);

  const ownerData = stats?.productsByOwner?.map((owner, index) => ({
    ...owner,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  })) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Overview of your products and operations</p>
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Package className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          subtitle="Across all owners"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={stats?.activeProducts || 0}
          subtitle="Currently live"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Low Inventory"
          value={stats?.lowInventoryCount || 0}
          subtitle="Below 10 units"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          title="Product Owners"
          value={stats?.ownerCount || 0}
          subtitle="Team members"
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Products by Owner</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution across team members</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ownerData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                  <Bar dataKey="productCount" radius={[0, 8, 8, 0]} maxBarSize={40}>
                    {ownerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Product lifecycle breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} products`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Products</CardTitle>
            <p className="text-sm text-muted-foreground">Latest additions to your inventory</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentProducts?.slice(0, 5).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}/edit`}
                className="flex items-center justify-between p-4 rounded-xl border bg-white hover:bg-gray-50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <StatusBadge status={product.status} />
                  <span className="font-bold text-lg min-w-[80px] text-right">
                    {formatCurrency(parseFloat(product.price))}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
