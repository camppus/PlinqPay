import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com/plinqpay" },
    { icon: <FaTwitter />, href: "https://twitter.com/plinqpay" },
    { icon: <FaInstagram />, href: "https://instagram.com/plinqpay" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com/company/plinqpay" },
  ];

  return (
    <footer className="bg-background/90 backdrop-blur border-b pb-5 border-dashed">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <img src="/logo.png" className="h-10  object-contain" alt="" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PlinqPay. Todos os direitos reservados.
          </p>
        </div>

        <div className="flex gap-4">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full  border hover:bg-blue-500  transition-all"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      <p className="text-center text-muted">by Francisco Diakomas@</p>
    </footer>
  );
}
