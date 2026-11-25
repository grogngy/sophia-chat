"use client";

export default function ContactInfo() {
  // Use environment variables if available, otherwise fall back to generic placeholders
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contact@example.com";
  const website = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "https://example.com";
  const whatsapp = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "+1 000 000 0000";

  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Sitio Web:</strong>{" "}
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {website}
        </a>
      </p>
      <p>
        <strong>WhatsApp:</strong>{" "}
        <a 
          href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {whatsapp}
        </a>
      </p>
    </div>
  );
}
