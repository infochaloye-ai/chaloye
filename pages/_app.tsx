import "@/styles/globals.css";
import App, { type AppContext, type AppProps } from "next/app";
import { useRouter } from "next/router";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Layout from "@/components/site/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import { AuthProvider } from "@/context/AuthContext";
import { CMSProvider } from "@/context/CMSContext";
import { getAdapter } from "@/lib/cms/adapter";
import type { CMSSnapshot } from "@/lib/cms/types";
import { ToastProvider } from "@/components/admin/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });

type Props = AppProps & { cms?: CMSSnapshot };

export default function MyApp({ Component, pageProps, cms }: Props) {
  const { pathname } = useRouter();
  const isAdmin = pathname.startsWith("/admin");
  const isBareAdmin = pathname === "/admin/login";

  return (
    <>
      {/* Font variables live on :root so portalled modals get them too. */}
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-bricolage: ${bricolage.style.fontFamily};
        }
      `}</style>
      <CMSProvider initialData={cms!}>
        <AuthProvider>
          {isAdmin ? (
            <ToastProvider>
              {isBareAdmin ? (
                <Component {...pageProps} />
              ) : (
                <AdminLayout>
                  <Component {...pageProps} />
                </AdminLayout>
              )}
            </ToastProvider>
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </AuthProvider>
      </CMSProvider>
    </>
  );
}

// Every page needs site content, so the first (server) render loads it from Supabase.
// Client-side navigations keep the content already in CMSProvider.
MyApp.getInitialProps = async (context: AppContext) => {
  const props = await App.getInitialProps(context);
  if (typeof window !== "undefined") return props;
  return { ...props, cms: await getAdapter().load() };
};
