"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { EditableFullName } from "./EditableFullName";
import { useUser } from "@/contexts/UserContext";

export function AccountInformationCard() {
  const user = useUser();
  
  // Format dates
  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Información de la Cuenta</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Correo Electrónico
          </label>
          <p className="text-sm">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Nombre Completo
          </label>
          <EditableFullName />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Miembro Desde
          </label>
          <p className="text-sm">{formatDate(user.created_at || null)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
