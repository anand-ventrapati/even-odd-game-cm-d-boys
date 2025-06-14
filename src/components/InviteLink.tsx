
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InviteLinkProps {
  link: string;
}

const InviteLink = ({ link }: InviteLinkProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsapp = () => {
    const text = `Join my Even-Odd game! Use this link: ${link}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-2 items-center mt-4">
      <div className="bg-white/20 p-2 rounded text-white text-center w-full break-all">{link}</div>
      <div className="flex gap-2">
        <Button onClick={handleCopy} className="bg-blue-600 text-white hover:bg-blue-700">
          {copied ? "Copied!" : "Copy Invite Link"}
        </Button>
        <Button onClick={handleWhatsapp} className="bg-green-600 text-white hover:bg-green-700">
          Share via WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default InviteLink;
