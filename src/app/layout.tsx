import type {Metadata} from "next"
import {Geist,Geist_Mono} from "next/font/google"
import favicon from "./favicon.ico"
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
        icon: favicon.src,
        shortcut: favicon.src,
        other: [
            {
                rel: "icon",
                url: favicon.src,
            },
        ],
    },
    alternates: {
        canonical: "https://unfollow-non-followers.vercel.app",
        languages: {
            "es-ES": "/es-ES",
            "pt-BR": "/pt-BR",
            "zh-CN": "/zh-CN",
            "hi-IN": "/hi-IN",
            "ar-SA": "/ar-SA",
            "ja-JP": "/ja-JP",

        },
    },
    openGraph: {
        title: "Unfollow Non-Followers",
        description: "A simple tool to manage your GitHub followers",
        url: "https://unfollow-non-followers.vercel.app",
        siteName: "Unfollow Non-Followers",
        // images: [
        //     {
        //         url: favicon.src,
        //         width: 1200,
        //         height: 630,
        //     },
        // ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    )
}
