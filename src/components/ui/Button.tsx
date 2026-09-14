import Link from "next/link";

type Variant = "primary" | "secondary" | "whatsapp";

const styles: Record<Variant, string> = {
  primary: "bg-teal text-white hover:bg-[#0c6c70]",
  secondary: "border border-navy text-navy hover:bg-navy hover:text-salt",
  whatsapp: "bg-whatsapp text-navy hover:bg-[#1fb85a]",
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-2.5 font-semibold no-underline transition-colors duration-[var(--dur-micro)] cursor-pointer";

type Props = {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  variant?: Variant;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ children, href, external, variant = "primary", type = "button", className = "", onClick, disabled }: Props) {
  const cls = `${baseClass} ${styles[variant]} ${className}`;
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
