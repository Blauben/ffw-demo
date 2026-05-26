
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<html><body>
      <div id="background">
        <div id="main-content">
          {children}
        </div>
      </div>
    </body></html>)
}

