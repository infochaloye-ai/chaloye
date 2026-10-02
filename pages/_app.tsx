import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Layout from "@/components/site/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import { AuthProvider } from "@/context/AuthContext";
import { CMSProvider } from "@/context/CMSContext";
import { ToastProvider } from "@/components/admin/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
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
      <CMSProvider>
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
