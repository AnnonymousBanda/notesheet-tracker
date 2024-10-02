import './index.css'

export const metadata = {
  title: "NoteSheet-Tracker",
  description: "To keep track of your payment notesheets and share them with others",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
