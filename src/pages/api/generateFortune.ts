import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import OpenAI from "openai";
import { FortunePromptType } from "@/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

function getAIBehaviorPrompt(promptType: string) {
  switch (promptType) {
    case FortunePromptType.JOB_ADVICE:
      return `You are an all-knowing master of coding wisdom. Based on the user's GitHub profile, give concise advice on how they can land jobs. Add witty humor, make it sharp and clever, with a light roast. Limit to 98 words.`;

    case FortunePromptType.SKILL_IMPROVEMENT:
      return `You are an all-knowing mentor who gives sharp, insightful feedback. Look at the GitHub profile provided and suggest how the user can improve their coding skills. Be witty, wise, and add a playful roast while staying under 98 words.`;

    case FortunePromptType.MYSTICAL_ROAST:
    default:
      return `You are a master of both wit and wisdom. Craft a funny, insightful roast of the user's GitHub profile with sharp humor. Make it dev-oriented, cocky, and clever, but stay under 98 words.`;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, promptType } = req.query;

  if (!username || typeof username !== "string") {
    res.status(400).json({ error: "Invalid username" });
    return;
  }

  if (!promptType || typeof promptType !== "string") {
    res.status(400).json({ error: "Invalid prompt type" });
    return;
  }
  try {
    // Fetch GitHub user and repository data
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const userData = userResponse.data;
    const reposData = reposResponse.data;

    // Analyze repositories to infer developer type
    const languageCounts: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reposData.forEach((repo: any) => {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    const favoriteLanguage = Object.keys(languageCounts).reduce((a, b) =>
      languageCounts[a] > languageCounts[b] ? a : b
    );

    const userInfo = {
      name: userData.name || username,
      bio: userData.bio || "",
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      favorite_language: favoriteLanguage || "Unknown",
    };

    // Set headers to allow progressive streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Ensure the socket remains open
    res.socket?.setKeepAlive(true);

    // Generate a fortune using OpenAI API
    const systemPrompt = getAIBehaviorPrompt(promptType);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `This is the GitHub user info: ${JSON.stringify(userInfo)}.`,
        },
      ],
      stream: true,
    });

    // Stream the response chunk by chunk
    for await (const chunk of completion) {
      const chunkContent = chunk.choices[0]?.delta?.content || "";

      // Write the chunk to the response
      res.write(chunkContent);
    }

    // End the response stream when done
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate fortune" });
  }
}
