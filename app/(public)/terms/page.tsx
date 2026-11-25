import { Metadata } from "next";
import LegalPageWrapper from "@/components/legal/LegalPageWrapper";
import { generateLegalMetadata } from "@/lib/metadata";
import TableOfContents from "@/components/legal/TableOfContents";
import LegalLayout from "@/components/legal/LegalLayout";
import ContactInfo from "@/components/legal/ContactInfo";
import { PrivacyCompliance } from "@/components/legal/PrivacyCompliance";

const lastUpdated = "2025-01-15";

export const metadata: Metadata = generateLegalMetadata(
  "Términos de Servicio",
  "Términos de Servicio para Sophia by IdentIA Lab - Plataforma de chat con IA que proporciona acceso gratuito a múltiples modelos de IA."
);

const tocSections = [
  { id: "acceptance", title: "Aceptación de Términos", level: 1 },
  { id: "description", title: "Descripción del Servicio", level: 1 },
  { id: "account", title: "Registro de Cuenta", level: 1 },
  { id: "usage", title: "Uso Aceptable", level: 1 },
  { id: "content", title: "Contenido del Usuario", level: 1 },
  { id: "intellectual", title: "Propiedad Intelectual", level: 1 },
  { id: "privacy", title: "Privacidad y Datos", level: 1 },
  { id: "termination", title: "Terminación", level: 1 },
  { id: "disclaimers", title: "Descargos de Responsabilidad", level: 1 },
  { id: "limitation", title: "Limitación de Responsabilidad", level: 1 },
  { id: "indemnification", title: "Indemnización", level: 1 },
  { id: "governing", title: "Ley Aplicable", level: 1 },
  { id: "contact", title: "Información de Contacto", level: 1 },
];

export default function TermsOfService() {
  return (
    <LegalLayout tocSidebar={<TableOfContents sections={tocSections} />}>
      <LegalPageWrapper
        title="Términos de Servicio"
        lastUpdated={lastUpdated}
        description="Estos Términos de Servicio rigen tu uso de Sophia by IdentIA Lab, una plataforma de chat con IA que proporciona acceso gratuito a múltiples modelos de IA."
      >
        {/* Acceptance of Terms */}
        <section id="acceptance">
          <h2>1. Aceptación de Términos</h2>
          <p>
            Al acceder o usar Sophia by IdentIA Lab (&ldquo;Servicio&rdquo;), aceptas
            estar sujeto a estos Términos de Servicio (&ldquo;Términos&rdquo;). Si no
            estás de acuerdo con alguna parte de estos términos, entonces no puedes acceder al
            Servicio.
          </p>
          <p>
            Estos Términos se aplican a todos los visitantes, usuarios y otros que accedan o
            usen el Servicio, incluyendo pero no limitado a usuarios que son
            suscriptores de nuestros servicios pagos.
          </p>
          <p>
            Nos reservamos el derecho de actualizar y cambiar estos Términos de vez en
            cuando sin previo aviso. Cualquier nueva funcionalidad que aumente o mejore el
            Servicio actual estará sujeta a los Términos. El uso continuo del
            Servicio después de tales cambios constituye tu consentimiento a dichos
            cambios.
          </p>
        </section>

        {/* Service Description */}
        <section id="description">
          <h2>2. Descripción del Servicio</h2>
          <p>
            Sophia by IdentIA Lab es una interfaz de chat unificada que proporciona acceso a
            múltiples modelos de IA incluyendo pero no limitado a:
          </p>
          <ul>
            <li>Modelos OpenAI GPT (GPT-4, GPT-3.5-turbo, y otros)</li>
            <li>Modelos Anthropic Claude</li>
            <li>Modelos Google Gemini</li>
            <li>Modelos Meta LLaMA</li>
            <li>Otros modelos de IA a medida que estén disponibles</li>
          </ul>
          <p>
            El Servicio permite a los usuarios interactuar con estos modelos de IA a través de una
            interfaz única y consistente, con características que incluyen historial de
            conversaciones y cambio de modelos.
          </p>
          <p>
            El servicio proporciona acceso gratuito a múltiples modelos de IA con capacidades
            y características variables dependiendo del modelo seleccionado.
          </p>
        </section>

        {/* Account Registration */}
        <section id="account">
          <h2>3. Account Registration and Security</h2>
          <p>
            To access certain features of the Service, you must register for an
            account. You agree to:
          </p>
          <ul>
            <li>
              Provide accurate, current, and complete information during
              registration
            </li>
            <li>Maintain the security of your password and account</li>
            <li>
              Notify us immediately of any breach of security or unauthorized
              use
            </li>
            <li>
              Accept responsibility for all activities that occur under your
              account
            </li>
            <li>
              Be at least 13 years of age (or the minimum age in your
              jurisdiction)
            </li>
          </ul>
          <p>
            We reserve the right to refuse service or terminate accounts at our
            sole discretion, particularly for violations of these Terms.
          </p>
        </section>

        {/* Acceptable Use */}
        <section id="usage">
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>
              Generate illegal, harmful, threatening, abusive, or defamatory
              content
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
            </li>
            <li>
              Violate any applicable local, state, national, or international
              law
            </li>
            <li>
              Attempt to gain unauthorized access to the Service or other
              users&rsquo; accounts
            </li>
            <li>Distribute spam, malware, or other malicious content</li>
            <li>
              Use the Service for any commercial purpose without our written
              consent
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              Service
            </li>
            <li>
              Generate content that infringes on intellectual property rights
            </li>
            <li>
              Use the Service to compete with us or develop competing services
            </li>
          </ul>
          <p>
            We reserve the right to monitor usage and suspend or terminate
            accounts that violate these guidelines.
          </p>
        </section>

        {/* User Content */}
        <section id="content">
          <h2>5. User Content and Data</h2>
          <p>
            You retain ownership of any content you input into the Service
            (&quot;User Content&quot;). By using the Service, you grant us:
          </p>
          <ul>
            <li>A license to process your content to provide the Service</li>
            <li>The right to store conversation history for your account</li>
            <li>
              Permission to use aggregated, anonymized data for service
              improvement
            </li>
          </ul>
          <p>
            You are responsible for your User Content and must ensure you have
            all necessary rights to submit it. We are not responsible for the
            accuracy, quality, or legality of User Content.
          </p>
          <p>
            AI-generated responses are not considered User Content and may be
            used by us for service improvement, subject to our Privacy Policy.
          </p>
        </section>

        {/* Intellectual Property */}
        <section id="intellectual">
          <h2>6. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality
            are owned by YourApp and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property
            laws.
          </p>
          <p>
            You may not copy, modify, distribute, sell, or lease any part of our
            Service or included software, nor may you reverse engineer or
            attempt to extract the source code of that software.
          </p>
          <p>
            All trademarks, service marks, and logos used in connection with the
            Service are the property of their respective owners.
          </p>
        </section>

        {/* Privacy and Data */}
        <section id="privacy">
          <h2>7. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we
            collect, use, and protect your information when you use our Service.
          </p>
          <p>
            By using the Service, you consent to our collection and use of
            personal information as outlined in our Privacy Policy, which is
            incorporated into these Terms by reference.
          </p>
          <p>
            We implement appropriate security measures to protect your personal
            information, but cannot guarantee absolute security of data
            transmitted over the internet.
          </p>
        </section>

        {/* Termination */}
        <section id="termination">
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice or liability, for any reason,
            including breach of these Terms.
          </p>
          <p>Upon termination:</p>
          <ul>
            <li>Your right to use the Service will cease immediately</li>
            <li>We may delete your account and data after 30 days</li>
            <li>
              You remain liable for all charges incurred prior to termination
            </li>
            <li>
              Provisions that should survive termination will remain in effect
            </li>
          </ul>
          <p>
            You may terminate your account at any time by contacting us or using
            account deletion features in the Service.
          </p>
        </section>

        {/* Compliance Notice */}
        <section className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              🛡️ This service complies with <strong>GDPR</strong> and{" "}
              <strong>CCPA</strong> privacy regulations. See our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{" "}
              for details.
            </span>
          </div>
        </section>

        {/* Disclaimers */}
        <section id="disclaimers">
          <h2>9. Disclaimers</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis. We expressly disclaim all warranties of any
            kind, whether express or implied, including but not limited to:
          </p>
          <ul>
            <li>
              Implied warranties of merchantability and fitness for a particular
              purpose
            </li>
            <li>Non-infringement of third-party rights</li>
            <li>Accuracy, reliability, or availability of the Service</li>
            <li>Security of data or communications</li>
          </ul>
          <p>
            AI-generated content may contain errors, biases, or inaccuracies.
            You should verify important information independently and not rely
            solely on AI responses for critical decisions.
          </p>
          <p>
            We do not warrant that the Service will meet your requirements or be
            available on an uninterrupted, secure, or error-free basis.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section id="limitation">
          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall
            ShipKit.ai be liable for any indirect, punitive, incidental,
            special, consequential, or exemplary damages, including without
            limitation damages for loss of profits, goodwill, use, data, or
            other intangible losses.
          </p>
          <p>
            Our total liability to you for all damages, losses, and causes of
            action (whether in contract, tort, or otherwise) will not exceed the
            amount paid by you, if any, for accessing the Service during the
            twelve (12) months immediately preceding the date of the claim.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties
            or limitation of liability for consequential or incidental damages,
            so these limitations may not apply to you.
          </p>
        </section>

        {/* Indemnification */}
        <section id="indemnification">
          <h2>11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless ShipKit.ai and its
            officers, directors, employees, and agents from and against any and
            all claims, damages, obligations, losses, liabilities, costs, and
            expenses (including attorney&rsquo;s fees) arising from:
          </p>
          <ul>
            <li>Your use of and access to the Service</li>
            <li>Your violation of any term of these Terms</li>
            <li>
              Your violation of any third-party right, including intellectual
              property rights
            </li>
            <li>
              Any claim that your User Content caused damage to a third party
            </li>
          </ul>
        </section>

        {/* Governing Law */}
        <section id="governing">
          <h2>12. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of [Your
            Jurisdiction], without regard to its conflict of law provisions. Any
            disputes arising from these Terms or your use of the Service will be
            resolved through binding arbitration in accordance with the rules of
            the American Arbitration Association.
          </p>
          <p>
            You and ShipKit.ai agree that any dispute resolution proceedings
            will be conducted only on an individual basis and not in a class,
            consolidated, or representative action.
          </p>
          <p>
            If for any reason a court of competent jurisdiction finds that this
            arbitration provision is unenforceable, then the dispute will be
            resolved in the state or federal courts located in [Your
            Jurisdiction].
          </p>
        </section>

        {/* Contact Information */}
        <section id="contact">
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          
          {/* Dynamic Country-Specific Compliance */}
          <div className="mb-6">
            <PrivacyCompliance />
          </div>
          
          <ContactInfo />
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Last Updated:</strong> {lastUpdated}
          </p>
        </section>

        <div className="section-divider"></div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            These Terms of Service are effective as of {lastUpdated} and will
            remain in effect except with respect to any changes in their
            provisions in the future, which will be in effect immediately after
            being posted on this page.
          </p>
        </div>
      </LegalPageWrapper>
    </LegalLayout>
  );
}
