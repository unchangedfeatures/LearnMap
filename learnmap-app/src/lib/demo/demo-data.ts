export type DemoRoadmap = {
  topic: string;
  title: string;
  description: string;
  chapters: Array<{
    title: string;
    guides: string[];
  }>;
};

export const demoRoadmap: DemoRoadmap = {
  topic: "Linear Algebra",
  title: "Linear Algebra for CS Students",
  description:
    "A practical roadmap focused on intuition first, then fluency: vectors → matrices → transformations → eigenthings, with short guides and check-point quizzes.",
  chapters: [
    {
      title: "1) Vectors and Geometry",
      guides: [
        "What a vector really is",
        "Dot product: similarity and projection",
        "Norms and distance (why L2 matters)",
        "Angle, cosine similarity, and intuition",
        "Mini problems: interpret vectors in 2D/3D",
      ],
    },
    {
      title: "2) Matrices as Functions",
      guides: [
        "Matrix-vector multiplication as a transform",
        "Composition and matrix multiplication",
        "Invertibility and what it means",
        "Rank and why systems have (no/one/many) solutions",
        "Mini problems: solve small systems",
      ],
    },
    {
      title: "3) Eigenvalues and Eigenvectors",
      guides: [
        "Why eigenvectors matter",
        "Diagonalization (when it works)",
        "Geometric meaning: stretching directions",
        "Common patterns in ML and graphics",
        "Mini problems: compute eigens for 2×2",
      ],
    },
  ],
};

export const demoIntake = {
  topic: demoRoadmap.topic,
  questions: [
    {
      q: "What’s your main goal?",
      answers: ["Pass an exam", "Use in ML", "Graphics", "Curiosity"],
    },
    {
      q: "How comfortable are you with basic algebra?",
      answers: ["I struggle", "Okay", "Strong"],
    },
    {
      q: "Do you prefer intuition or proofs first?",
      answers: ["Intuition", "Balanced", "Proofs"],
    },
    {
      q: "How much time can you spend weekly?",
      answers: ["~2 hours", "~5 hours", "10+ hours"],
    },
  ],
};

export const demoGuideMarkdown = `# Dot product (intuition-first)

The **dot product** answers a simple question:

> **How aligned are two vectors?**

## 1) The formula

For two vectors \(a\) and \(b\):

\[ a \cdot b = \sum_i a_i b_i \]

## 2) The geometric meaning

\[ a \cdot b = \|a\|\,\|b\|\cos(\theta) \]

- If \(\theta\) is small → vectors point similarly → dot product is **large**.
- If \(\theta = 90^\circ\) → dot product is **0** (orthogonal).
- If \(\theta > 90^\circ\) → dot product becomes **negative**.

## 3) Projection (why it’s useful)

The dot product is used to compute **projections**, which show up in:
- similarity (cosine similarity)
- least squares
- machine learning (feature alignment)

> In LearnMap, guides are generated as **Markdown** and rendered with GFM support.
`;

export const demoQuiz = {
  title: "Chapter quiz: Vectors and Geometry",
  passRule: "Pass threshold is 4/5 (product rule).",
  questions: [
    {
      q: "If two vectors are orthogonal, their dot product is…",
      options: ["1", "0", "-1", "It depends on length"],
      answer: 1,
    },
    {
      q: "Which statement best matches a matrix in this roadmap?",
      options: [
        "A list of numbers",
        "A function that transforms vectors",
        "Only a way to store images",
        "A random table",
      ],
      answer: 1,
    },
  ],
};
