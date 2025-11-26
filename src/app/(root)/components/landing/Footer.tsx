"use client";

import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">
              Red Seal Pro
            </h3>
            <p className="text-sm text-muted-foreground">
              A melhor plataforma para preparação do exame Red Seal no Canadá.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-primary transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-primary transition-colors"
                >
                  Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#trades"
                  className="hover:text-primary transition-colors"
                >
                  Trades Disponíveis
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary transition-colors"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="hover:text-primary transition-colors"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="hover:text-primary transition-colors"
                >
                  Comunidade
                </a>
              </li>
              <li>
                <a
                  href="#status"
                  className="hover:text-primary transition-colors"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-primary transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#refund"
                  className="hover:text-primary transition-colors"
                >
                  Política de Reembolso
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Red Seal Pro. Todos os direitos reservados.</p>
          <p>🇨🇦 Feito com ❤️ no Canadá</p>
        </div>
      </div>
    </footer>
  );
}
