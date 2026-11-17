import { Container } from "@/components/ui/Container";
import { WatchQuiz } from "@/components/quiz/WatchQuiz";

export function VideoQuizSection() {
  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <WatchQuiz mode="home" />
      </Container>
    </section>
  );
}
