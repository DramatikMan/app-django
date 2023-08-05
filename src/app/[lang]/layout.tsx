import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import DarkTheme from "./theme";

export const metadata = {title: "Music App"};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body style={{height: "100%"}}>
                <DarkTheme>{children}</DarkTheme>
            </body>
        </html>
    );
}
