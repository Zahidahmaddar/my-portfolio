import Contours from "@/components/common/Contours";
import ContactForm from "@/components/site/ContactForm";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="wrap section">
      <div className="on-band relative overflow-hidden bg-band text-on-band rounded-3xl p-6 sm:p-10 md:p-12 grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 md:gap-14">
        <Contours className="opacity-[0.1]" />
        <div className="relative">
          <h2 className="section-title">Tell me what you&apos;re building.</h2>
          <p className="mt-3 text-on-band-muted max-w-[42ch]">
            Hiring, or have a project in mind? Send a message and it comes straight
            to my inbox.
          </p>
          <ul className="mt-6 space-y-1.5 font-medium">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-4 decoration-band-line hover:decoration-saffron break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-band-line hover:decoration-saffron"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-band-line hover:decoration-saffron"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="relative">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
