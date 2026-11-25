import { getPrivacyComplianceText } from "@/lib/geolocation";

export async function PrivacyCompliance() {
  const complianceText = await getPrivacyComplianceText();
  
  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <p className="text-sm text-muted-foreground text-center">
        <strong>Cumplimiento Legal:</strong> {complianceText}
      </p>
    </div>
  );
}
