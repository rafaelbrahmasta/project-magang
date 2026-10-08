"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, clearToken, getToken } from "@/lib/api";
import { FACULTY } from "@/lib/site";

const menu = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/fakultas", label: FACULTY ? "Profil Fakultas" : "Fakultas" },
    { href: "/admin/prodi", label: "Program Studi" },
    { href: "/admin/dosen", label: "Dosen" },
    { href: "/admin/berita", label: "Berita" },
    { href: "/admin/produk", label: "Produk" },
    { href: "/admin/galeri", label: "Galeri" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const isLogin = pathname === "/admin/login";

    useEffect(() => {
        if (isLogin) {
            setReady(true);
            return;
        }
        if (!getToken()) {
            router.replace("/admin/login");
            return;
        }
        api("/auth/me")
            .then(() => setReady(true))
            .catch(() => {
                clearToken();
                router.replace("/admin/login");
            });
    }, [isLogin, router]);

    if (isLogin) return <>{children}</>;
    if (!ready) return <div className="p-8 text-gray-500">Memuat...</div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-60 shrink-0 bg-[#0B3D91] p-4 text-white">
                <p className="mb-6 px-2 text-lg font-bold">Admin Fakultas</p>
                <nav className="space-y-1">
                    {menu.map((m) => (
                        <Link
                            key={m.href}
                            href={m.href}
                            className={`block rounded-lg px-3 py-2 text-sm ${pathname.startsWith(m.href) ? "bg-[#1E6FD9] font-semibold" : "hover:bg-white/10"
                                }`}
                        >
                            {m.label}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={() => {
                        clearToken();
                        router.replace("/admin/login");
                    }}
                    className="mt-6 w-full rounded-lg border border-white/30 px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                    Keluar
                </button>
            </aside>
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}