import { ShieldAlert } from "lucide-react";

export default function DemoNotice() {
  return (
    <div className="notice" role="note">
      <ShieldAlert size={20} />
      <p>
        <strong>Frontend demo only, not secure.</strong> Accounts and passwords
        are stored unencrypted in this browser's LocalStorage. Production
        authentication requires a secure backend with hashed passwords, secure
        sessions or tokens, and HTTPS. Don't use a real password here.
      </p>
    </div>
  );
}