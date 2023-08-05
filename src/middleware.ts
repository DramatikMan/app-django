import {NextRequest, NextResponse} from "next/server";

import {locales, defaultLocale} from "~/translation";
import type {Locale} from "~/translation";

function redirectToLocale(locale: Locale, request: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(`/${locale}/${request.nextUrl.pathname}`, request.url));
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const header = request.headers.get("accept-language");

    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            return NextResponse.next();
        }

        if (header === null) {
            return redirectToLocale(defaultLocale, request);
        }

        if (header.startsWith(locale)) {
            return redirectToLocale(locale, request);
        }
    }

    return redirectToLocale(defaultLocale, request);
}

export const config = {
    matcher: ["/((?!_next).*)"],
};
