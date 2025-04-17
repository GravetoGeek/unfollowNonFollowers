import type {Metadata} from "next"
import {Geist,Geist_Mono} from "next/font/google"
import "./globals.css"

const geistSans=Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono=Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata={
    title: "Unfollow Non-Followers",
    description: "A simple tool to manage your GitHub followers",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
        other: [
            {
                rel: "icon",
                url: "/favicon.ico",
            },
        ],
    },
    openGraph: {
        title: "Unfollow Non-Followers",
        description: "A simple tool to manage your GitHub followers",
        url: "https://unfollow-non-followers.vercel.app",
        siteName: "Unfollow Non-Followers",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    )
}
