import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

async function ensureTable() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS player_posts (
      id         TEXT PRIMARY KEY,
      player_id  TEXT NOT NULL,
      game_day   INTEGER NOT NULL,
      ticker     TEXT,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL,
      flair      TEXT NOT NULL,
      author     TEXT NOT NULL,
      upvotes    INTEGER DEFAULT 1,
      downvotes  INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_player_posts_pid ON player_posts(player_id)`;
}

export async function POST(req: NextRequest) {
  if (!sql) return NextResponse.json({ ok: false, error: "DB not configured" }, { status: 503 });

  try {
    const body = await req.json();
    await ensureTable();
    await sql`
      INSERT INTO player_posts (id, player_id, game_day, ticker, title, body, flair, author)
      VALUES (${body.id}, ${body.playerId}, ${body.gameDay}, ${body.ticker ?? null},
              ${body.title}, ${body.body}, ${body.flair}, ${body.author})
      ON CONFLICT (id) DO NOTHING
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("blog POST error", err);
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!sql) return NextResponse.json({ posts: [] });

  try {
    const playerId = req.nextUrl.searchParams.get("playerId");
    if (!playerId) return NextResponse.json({ posts: [] });

    await ensureTable();
    const posts = await sql`
      SELECT * FROM player_posts
      WHERE player_id = ${playerId}
      ORDER BY game_day DESC
      LIMIT 200
    `;
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("blog GET error", err);
    return NextResponse.json({ posts: [] });
  }
}
