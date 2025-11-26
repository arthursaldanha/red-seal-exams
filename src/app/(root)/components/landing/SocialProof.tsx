import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "João Silva",
    trade: "Electrician",
    avatar: "JS",
    rating: 5,
    text: "Passei de primeira graças às questões da plataforma. O material é excelente e muito similar ao exame real!",
  },
  {
    name: "Maria Santos",
    trade: "Plumber",
    avatar: "MS",
    rating: 5,
    text: "Os simulados me deixaram super preparada. Recomendo para todos que querem o Red Seal.",
  },
  {
    name: "Pedro Costa",
    trade: "Welder",
    avatar: "PC",
    rating: 5,
    text: "Melhor investimento que fiz na minha carreira. O suporte também é muito bom!",
  },
];

const stats = [
  { value: "2,500+", label: "Alunos Aprovados" },
  { value: "15+", label: "Trades Cobertos" },
  { value: "10,000+", label: "Questões Disponíveis" },
  { value: "98%", label: "Taxa de Aprovação" },
];

export function SocialProof() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Aprovados que Recomendam
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que conseguiram sua
            certificação Red Seal conosco.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover-scale transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-foreground mb-6">
                  `&quot;`{testimonial.text}`&quot;`
                </p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.trade}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
