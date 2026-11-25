"use client";

import { Suspense } from "react";
import { AccountInformationCard } from "./AccountInformationCard";
import { ProfilePageSkeleton } from "./ProfileCardSkeletons";

function ProfilePageContent() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y preferencias.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <AccountInformationCard />
      </div>
    </div>
  );
}

export default function ProfilePageClient() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
