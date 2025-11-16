import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({  
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "Mi Aplicación de Autenticación con NextAuth",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="es">
      <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="w-full bg-black shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-white text-xl font-semibold hover:text-gray-300">
              MyAuthApp
            </Link>

            <ul className="flex items-center justify-center gap-6 text-sm text-white">
              {session?.user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="hover:text-gray-300 transition">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="hover:text-gray-300 transition">
                      Perfil
                    </Link>
                  </li>
                  {session?.user?.image && (
                    <li>
                      <Image
                        height={40}
                        width={40}
                        alt="user"
                        src={session?.user?.image}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    </li>
                  )}
                  <li>
                    <LogoutButton />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/signIn" className="hover:text-gray-300 transition">
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Provider>
          <main>{children}</main>
        </Provider>

      </body>
    </html>
  );
}
