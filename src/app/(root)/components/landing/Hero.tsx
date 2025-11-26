import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              🎯 Plataforma #1 para Red Seal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Passe no Red Seal na{" "}
              <span className="text-primary">Primeira Tentativa</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Prepare-se com milhares de questões reais, simulados cronometrados
              e material atualizado para todos os trades certificados.
            </p>

            {/* Benefits List */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">
                  Questões atualizadas 2025
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">Simulados ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">Suporte especializado</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base hover-scale">
                <Link href="/signup">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="#pricing">Ver Planos</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <p className="mt-8 text-sm text-muted-foreground">
              ✅ Mais de{" "}
              <strong className="text-foreground">
                2,500+ alunos aprovados
              </strong>{" "}
              em 2024
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-lg border bg-card shadow-2xl overflow-hidden">
              {/* Mockup da plataforma */}
              <div className="aspect-video bg-linear-to-br from-primary/10 to-accent/20 p-8">
                <div className="bg-background rounded-lg shadow-lg p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-20 bg-primary/10 rounded border border-primary"></div>
                      <div className="h-20 bg-muted rounded"></div>
                      <div className="h-20 bg-muted rounded"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-lg shadow-lg p-4 animate-scale-in">
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Taxa de aprovação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
