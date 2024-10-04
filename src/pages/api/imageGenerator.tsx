import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { method } = req;

  // accepts a request body containing data to generate image
  if (method === "POST") {
    const reqBody = await req.json();
    const body = await reqBody;

    if (!body.success) {
      return new Response(body.error.errors.toString(), {
        status: 400,
      });
    }
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          👋 Hello
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
