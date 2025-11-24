import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { deleteMember, getMemberById, updateMember } from "@/lib/members";
import { memberSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const notFound = NextResponse.json({ error: "Member not found" }, { status: 404 });

export async function GET(_: Request, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const member = await getMemberById(id);
  if (!member) return notFound;

  return NextResponse.json({ member });
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const json = await request.json();
  const parsed = memberSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  const existing = await getMemberById(id);
  if (!existing) return notFound;

  try {
    const updated = await updateMember(id, parsed.data);
    return NextResponse.json({ member: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update member." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await getMemberById(id);
  if (!existing) return notFound;

  try {
    await deleteMember(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to delete member." },
      { status: 500 },
    );
  }
}

