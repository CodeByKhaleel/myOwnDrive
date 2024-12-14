"use client"
import { navItems } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from "@/lib/utils";
const Sidebar = () => {
    const pathname = usePathname()
    return (
        <aside className='sidebar'>
            <Link href="/">
                <Image
                    src="/assets/icons/logo-full-brand.svg"
                    alt="logo"
                    width={160}
                    height={50}
                    className="hidden h-auto lg:block"
                />
                <Image
                    src="/assets/icons/logo-brand.svg"
                    alt="logo"
                    width={52}
                    height={52}
                    className="lg:hidden"
                />
            </Link>
            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map(({ url, name, icon }) => (
                        <li key={name} className="lg:w-full">
                            <Link
                                href={url}
                                className={cn(
                                    "sidebar-nav-item flex items-center gap-3", // Ensures vertical alignment and spacing
                                    pathname === url && "shad-active"
                                )}
                            >
                                <Image src={icon} alt={name} width={24} height={24} />
                                <p className="text-base font-medium">{name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
