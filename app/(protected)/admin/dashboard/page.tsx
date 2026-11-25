import { getModelStatsForAdmin } from "@/app/actions/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Settings, Users, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

async function AdminStats() {
  try {
    const result = await getModelStatsForAdmin();

    if (!result.success) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Models
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const { totalModels, activeModels, inactiveModels } = result.data || {
      totalModels: 0,
      activeModels: 0,
      inactiveModels: 0,
    };

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModels}</div>
            <p className="text-xs text-muted-foreground">AI models in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeModels}
            </div>
            <p className="text-xs text-muted-foreground">Available for users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Models
            </CardTitle>
            <Settings className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {inactiveModels}
            </div>
            <p className="text-xs text-muted-foreground">
              Temporarily disabled
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load admin statistics</p>
      </div>
    );
  }
}

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage system configuration and monitor platform health.
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Overview */}
        <AdminStats />

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Model Management
              </CardTitle>
              <CardDescription>
                View, edit, and manage AI models available to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <span className="text-sm">Manage AI models configuration</span>
                <Button asChild className="w-full">
                  <Link
                    href="/admin/models"
                    className="flex items-center gap-2"
                  >
                    Manage Models
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User roles and access control</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <Button disabled className="w-full">
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
