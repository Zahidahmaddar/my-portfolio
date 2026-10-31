import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ChatbotLoader from "@/components/common/ChatbotLoader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] btn btn-primary"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ChatbotLoader />
    </>
  );
}
