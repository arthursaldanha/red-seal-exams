import {
  BookOpen,
  BarChart3,
  Clock,
  CheckSquare,
  FileText,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Banco de Questões Completo",
    description:
      "Milhares de questões organizadas por trade e tópico, todas baseadas nos exames reais do Red Seal.",
  },
  {
    icon: Clock,
    title: "Simulados Cronometrados",
    description:
      "Pratique em condições reais de prova com cronômetro e formato idêntico ao exame oficial.",
  },
  {
    icon: BarChart3,
    title: "Acompanhamento de Progresso",
    description:
      "Visualize seu desempenho com estatísticas detalhadas e identifique pontos de melhoria.",
  },
  {
    icon: CheckSquare,
    title: "Questões Atualizadas 2025",
    description:
      "Conteúdo constantemente atualizado seguindo as últimas mudanças do Red Seal Programme.",
  },
  {
    icon: FileText,
    title: "Ebooks e Materiais",
    description:
      "Acesso a guias de estudo, resumos e materiais complementares para todos os trades.",
  },
  {
    icon: Users,
    title: "Suporte Especializado",
    description:
      "Tire dúvidas com profissionais certificados e acesse nossa comunidade de estudantes.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Tudo que Você Precisa para Passar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa com todas as ferramentas necessárias para
            sua aprovação no Red Seal.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
