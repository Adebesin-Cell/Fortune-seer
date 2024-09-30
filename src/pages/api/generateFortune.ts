import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI();

type Data = {
  fortune?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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

    console.log(userData, reposData);

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

    // Generate a fortune using OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an ancient seer who gives mystical fortunes and playful roasts to GitHub users.",
        },
        {
          role: "user",
          content: `This is the GitHub user info: ${JSON.stringify(
            userInfo
          )}. Please generate a fortune in a medieval tone with a bit of roast.`,
        },
      ],
    });

    // Send the generated fortune back to the frontend
    const fortune = completion.choices[0].message?.content?.trim();
    res.status(200).json({ fortune });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate fortune" });
  }
}
