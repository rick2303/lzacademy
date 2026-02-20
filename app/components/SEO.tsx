import Head from "next/head";

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
}

export default function SEO({ title, description, url, image }: SEOProps) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url || "https://lz-englishacademy.com"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url || "https://lz-englishacademy.com"} />
            <meta property="og:image" content={image || "/og-default.jpg"} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || "/og-default.jpg"} />
        </Head>
    );
}
