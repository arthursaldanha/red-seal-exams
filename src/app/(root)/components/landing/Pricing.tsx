import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Básico",
    price: "29",
    period: "mês",
    description: "Ideal para começar sua preparação",
    features: [
      "500 questões por mês",
      "3 simulados completos",
      "Acesso a 1 trade",
      "Estatísticas básicas",
      "Suporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "49",
    period: "mês",
    description: "Mais popular entre aprovados",
    badge: "Mais Popular",
    features: [
      "Questões ilimitadas",
      "Simulados ilimitados",
      "Acesso a todos os trades",
      "Estatísticas avançadas",
      "Suporte prioritário",
      "Material em PDF",
      "Comunidade exclusiva",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "79",
    period: "mês",
    description: "Para quem quer garantir 100%",
    features: [
      "Tudo do plano Pro",
      "Mentoria 1-on-1 mensal",
      "Ebooks exclusivos",
      "Acesso vitalício aos materiais",
      "Garantia de aprovação",
      "Suporte 24/7",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Planos para Cada Necessidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para sua preparação. Todos com 7 dias de
            garantia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 animate-fade-in ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-105 hover:scale-110"
                  : "hover-scale hover:shadow-lg"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  Começar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center mt-12 text-muted-foreground">
          💳 Todos os planos incluem 7 dias de garantia de reembolso • Cancele a
          qualquer momento
        </p>
      </div>
    </section>
  );
}
