import DialogBoxProvider from "@/contexts/DialogBoxContext";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "NoteSheet-Tracker",
  description:
    "To keep track of your payment notesheets and share them with others",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DialogBoxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </DialogBoxProvider>
      </body>
    </html>
  );
}
