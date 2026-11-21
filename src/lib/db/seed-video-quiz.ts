/**
 * Seed the API-driven video/quiz catalogue from the existing demo content.
 * Safe to re-run: nothing is overwritten and no fake leaderboard rows are
 * created — the leaderboard fills up only with real quiz submissions.
 *
 *   npm run db:seed:video-quiz
 */
import { config } from "dotenv";
import postgres from "postgres";

import { demoComments, findDemoUser } from "../../data/comment-demo";
import { quizQuestions, videos as demoVideos } from "../../data/community";
import { VIDEO_QUIZ_CONTENT_KEY, videoQuizDefaults } from "../video-quiz-content";
import { slugify } from "../slug";

config({ path: [".env.local", ".env"] });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding.");
  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

  try {
    await sql`
      insert into content_blocks (key, data)
      values (${VIDEO_QUIZ_CONTENT_KEY}, ${sql.json(videoQuizDefaults)})
      on conflict (key) do nothing
    `;
    console.log("content_blocks['video-quiz'] ready.");

    const existingVideos = await sql<{ count: number }[]>`select count(*)::int as count from videos`;
    if (existingVideos[0]?.count === 0) {
      for (const video of demoVideos) {
        await sql`
          insert into videos (
            id, slug, title, description, category, host, episode, duration, views,
            thumbnail, source, youtube_id, featured, status, published_at
          ) values (
            ${video.id}, ${slugify(video.title)}, ${video.title},
            ${`A TalkNest ${video.category.toLowerCase()} episode hosted by ${video.host}.`},
            ${video.category}, ${video.host}, ${video.episode}, ${video.duration}, ${video.views},
            ${video.thumbnail}, 'youtube', ${video.youtubeId}, ${Boolean(video.featured)},
            'published', now()
          ) on conflict (id) do nothing
        `;
      }
      console.log(`Seeded ${demoVideos.length} videos.`);
    } else {
      console.log("Videos already present — left untouched.");
    }

    const existingQuizzes = await sql<{ count: number }[]>`select count(*)::int as count from quizzes`;
    if (existingQuizzes[0]?.count === 0) {
      const firstVideoId = demoVideos[0]?.id ?? null;
      const quizRows = [
        {
          id: "quiz-book",
          title: "TalkNest Book Quiz",
          slug: "talknest-book-quiz",
          description: "Six questions on Bengali literature, history and the TalkNest reading programme.",
          type: "book",
          videoId: null,
        },
        {
          id: "quiz-watch",
          title: "Watch & Quiz — Episode Challenge",
          slug: "watch-and-quiz-episode-challenge",
          description: "A short challenge to go with the TalkNest video shelf.",
          type: "watch",
          videoId: firstVideoId,
        },
      ];
      for (const quiz of quizRows) {
        await sql`
          insert into quizzes (
            id, slug, title, description, category, instructions, type, video_id,
            duration_minutes, featured, status
          ) values (
            ${quiz.id}, ${quiz.slug}, ${quiz.title}, ${quiz.description}, 'General',
            ${"Choose one answer per question. Explanations appear after each answer."},
            ${quiz.type}, ${quiz.videoId}, 2, ${quiz.type === "book"}, 'published'
          ) on conflict (id) do nothing
        `;
        for (const [index, question] of quizQuestions.entries()) {
          await sql`
            insert into quiz_questions (
              id, quiz_id, position, question, options, answer_index, explanation, marks
            ) values (
              ${`${quiz.id}-q${index + 1}`}, ${quiz.id}, ${index}, ${question.question},
              ${sql.json(question.options)}, ${question.answerIndex}, ${question.explanation}, 1
            ) on conflict (id) do nothing
          `;
        }
      }
      console.log(`Seeded ${quizRows.length} quizzes with ${quizQuestions.length} questions each.`);
    } else {
      console.log("Quizzes already present — left untouched.");
    }

    const existingComments = await sql<{ count: number }[]>`select count(*)::int as count from discussions`;
    if (existingComments[0]?.count === 0) {
      let position = 0;
      for (const [target, comments] of Object.entries(demoComments)) {
        // Keep each demo thread on one target so parentId links stay in-thread.
        const targetId = target === "quiz" ? "quiz-book" : demoVideos[0]!.id;
        for (const comment of comments) {
          const user = findDemoUser(comment.userId);
          const agoMinutes = position * 7 + 5;
          await sql`
            insert into discussions (
              id, target, target_id, user_name, body, parent_id, likes, created_at
            ) values (
              ${`demo-${target}-${comment.id}`}, ${target}, ${targetId},
              ${user.name}, ${comment.text},
              ${comment.parentId ? `demo-${target}-${comment.parentId}` : null},
              ${comment.likes}, now() - (${agoMinutes} || ' minutes')::interval
            ) on conflict (id) do nothing
          `;
          position += 1;
        }
      }
      console.log("Seeded demo discussion entries (no leaderboard rows).");
    } else {
      console.log("Discussions already present — left untouched.");
    }
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
