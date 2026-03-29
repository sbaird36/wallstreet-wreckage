import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

async function ensureTable() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS game_saves (
      player_id  TEXT        NOT NULL,
      slot_id    INTEGER     NOT NULL,
      player_name TEXT       NOT NULL,
      current_day INTEGER    NOT NULL,
      net_worth   NUMERIC    NOT NULL,
      saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      snapshot   JSONB       NOT NULL,
      PRIMARY KEY (player_id, slot_id)
    )
  `;
}

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId");
  if (!playerId) {
    return NextResponse.json({ error: "playerId required" }, { status: 400 });
  }

  if (!sql) return NextResponse.json([]);

  try {
    await ensureTable();
    const rows = await sql`
      SELECT slot_id, player_name, current_day, net_worth, saved_at, snapshot
      FROM game_saves
      WHERE player_id = ${playerId}
      ORDER BY slot_id
    `;
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/saves error", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { playerId, slotId, playerName, currentDay, netWorth, snapshot } = body;

  if (!playerId || slotId == null) {
    return NextResponse.json(
      { error: "playerId and slotId required" },
      { status: 400 }
    );
  }

  if (!sql) {
    return NextResponse.json(
      { ok: false, error: "DB not configured" },
      { status: 503 }
    );
  }

  try {
    await ensureTable();
    await sql`
      INSERT INTO game_saves (player_id, slot_id, player_name, current_day, net_worth, snapshot)
      VALUES (
        ${playerId},
        ${slotId},
        ${playerName},
        ${currentDay},
        ${netWorth},
        ${JSON.stringify(snapshot)}
      )
      ON CONFLICT (player_id, slot_id) DO UPDATE
        SET player_name  = EXCLUDED.player_name,
            current_day  = EXCLUDED.current_day,
            net_worth    = EXCLUDED.net_worth,
            saved_at     = NOW(),
            snapshot     = EXCLUDED.snapshot
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/saves error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get("playerId");
  const slotId = req.nextUrl.searchParams.get("slotId");

  if (!playerId || slotId == null) {
    return NextResponse.json(
      { error: "playerId and slotId required" },
      { status: 400 }
    );
  }

  if (!sql) {
    return NextResponse.json(
      { ok: false, error: "DB not configured" },
      { status: 503 }
    );
  }

  try {
    await ensureTable();
    await sql`
      DELETE FROM game_saves
      WHERE player_id = ${playerId} AND slot_id = ${Number(slotId)}
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/saves error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
