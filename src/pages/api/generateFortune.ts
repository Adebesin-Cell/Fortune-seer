import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    res.status(400).json({ error: "Invalid username" });
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
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an ancient seer who gives mystical fortunes and playful roasts to GitHub users. Keep your responses concise and ensure they do not exceed 98 words.",
        },
        {
          role: "user",
          content: `This is the GitHub user info: ${JSON.stringify(
            userInfo
          )}. Please generate a fortune in a medieval tone with a bit of roast.`,
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
