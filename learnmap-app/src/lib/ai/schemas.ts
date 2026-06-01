import { z } from "zod";

export const TopicQuestionsSchema = z
  .object({
    questions: z
      .array(
        z
          .object({
            id: z.enum(["q1", "q2", "q3", "q4"]),
            question: z.string().min(4),
            options: z.array(z.string().min(1)).min(3).max(6),
          })
          .strict()
      )
      .length(4),
  })
  .strict();

export type TopicQuestionsOutput = z.infer<typeof TopicQuestionsSchema>;

export const RoadmapSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  chapters: z
    .array(
      z.object({
        title: z.string().min(3),
        description: z.string().optional().default(""),
        guides: z
          .array(
            z.object({
              title: z.string().min(3),
            })
          )
          .min(5)
          .max(6),
      })
    )
    .min(5)
    .max(6),
});

export type RoadmapOutput = z.infer<typeof RoadmapSchema>;

export const RoadmapRequestSchema = z.object({
  topic: z.string().min(2).max(120),
  /**
   * Selected chip answers (persisted).
   * Note: if the user typed a free-form answer, we keep the chip as
   * "Something else (type)" and send the typed text separately.
   */
  topicAnswers: z.record(z.string(), z.string()).default({}),
  /**
   * Optional free-form overrides for questions where the user picked
   * "Something else (type)". Used to generate the roadmap prompt, but not
   * persisted.
   */
  topicAnswersTyped: z.record(z.string(), z.string()).optional().default({}),
  learningStyle: z.enum(["examples", "logic", "stories", "direct"]),
  goal: z.enum(["exam", "career", "curiosity", "specific_topic"]),
  extraContext: z.string().max(300).optional().default(""),
});

export type RoadmapRequest = z.infer<typeof RoadmapRequestSchema>;

export const GuideSchema = z
  .object({
    title: z.string().min(3),
    estimatedMinutes: z.number().int().min(3).max(90),
    sections: z
      .array(
        z
          .object({
            heading: z.string().min(3),
            body: z.string().min(20),
            codeExample: z.string().optional().default(""),
          })
          .strict()
      )
      .min(3)
      .max(8),
  })
  .strict();

export type GuideOutput = z.infer<typeof GuideSchema>;

export const QuizSchema = z
  .object({
    questions: z
      .array(
        z
          .object({
            question: z.string().min(6),
            options: z.tuple([
              z.string().min(1),
              z.string().min(1),
              z.string().min(1),
              z.string().min(1),
            ]),
            correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            explanation: z.string().min(6),
          })
          .strict()
      )
      .length(5),
  })
  .strict();

export type QuizOutput = z.infer<typeof QuizSchema>;
