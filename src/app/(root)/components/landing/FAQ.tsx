import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "O que é o Red Seal?",
    answer:
      "O Red Seal (Selo Vermelho) é um programa canadense de certificação interprovincial que permite profissionais qualificados trabalhar em qualquer província ou território do Canadá sem precisar de certificações adicionais.",
  },
  {
    question: "Quantas questões estão disponíveis?",
    answer:
      "Temos mais de 10.000 questões no banco de dados, cobrindo todos os trades certificados pelo Red Seal. As questões são constantemente atualizadas para refletir as mudanças nos exames oficiais.",
  },
  {
    question: "Os simulados são iguais ao exame real?",
    answer:
      "Nossos simulados são estruturados seguindo o formato oficial do Red Seal, incluindo número de questões, tempo de prova e distribuição de tópicos. Muitos alunos relatam que o exame real foi muito similar aos nossos simulados.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades. Todos os planos incluem 7 dias de garantia de reembolso.",
  },
  {
    question: "Vocês oferecem suporte em português?",
    answer:
      "Sim, oferecemos suporte completo em português e inglês. Nossa equipe está disponível por email e chat para ajudar com qualquer dúvida.",
  },
  {
    question: "Qual a taxa de aprovação dos alunos?",
    answer:
      "Nossa taxa de aprovação é de 98% entre os alunos que completam pelo menos 80% do conteúdo disponível. Comparado com a média nacional de 70%, nossos resultados demonstram a eficácia do método.",
  },
  {
    question: "O conteúdo está atualizado para 2025?",
    answer:
      "Sim! Nosso conteúdo é revisado e atualizado trimestralmente para garantir que está alinhado com as últimas mudanças do Red Seal Programme. A última atualização foi em janeiro de 2025.",
  },
  {
    question: "Posso acessar de qualquer dispositivo?",
    answer:
      "Sim, nossa plataforma é 100% responsiva e funciona perfeitamente em computadores, tablets e smartphones. Você pode estudar onde e quando quiser.",
  },
];

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre a plataforma e o processo de certificação
            Red Seal.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ainda tem dúvidas?</p>
          <Button variant="outline" size="lg">
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  );
}
