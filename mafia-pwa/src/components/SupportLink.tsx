import { phrases } from "@/lib/phrases";
import { BOOSTY_URL } from "@/lib/links";

interface SupportLinkProps {
  className?: string;
}

export default function SupportLink({ className }: SupportLinkProps) {
  return (
    <a
      href={BOOSTY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center text-sm text-foreground/50 underline-offset-4 hover:text-foreground/70 hover:underline ${className ?? ""}`}
    >
      {phrases.support.link}
    </a>
  );
}
