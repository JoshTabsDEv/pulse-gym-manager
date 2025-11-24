import { RowDataPacket } from "mysql2";

import { execute, queryRows } from "@/lib/db";
import { Member, MemberPayload } from "@/types/member";

type MemberRow = RowDataPacket & {
  id: number;
  full_name: string;
  membership_type: string;
  status: Member["status"];
  start_date: string;
  end_date: string | null;
  created_at: string;
};

const MEMBER_COLUMNS = `
  id,
  full_name,
  membership_type,
  status,
  start_date,
  end_date,
  created_at
`;

const toIsoString = (value: string | null) =>
  value ? new Date(value).toISOString() : null;

const mapRow = (row: MemberRow): Member => ({
  id: row.id,
  fullName: row.full_name,
  membershipType: row.membership_type,
  status: row.status,
  startDate: new Date(row.start_date).toISOString(),
  endDate: toIsoString(row.end_date),
  createdAt: new Date(row.created_at).toISOString(),
});

export async function getMembers(): Promise<Member[]> {
  const rows = await queryRows<MemberRow[]>(
    `SELECT ${MEMBER_COLUMNS} FROM members ORDER BY created_at DESC`,
  );
  return rows.map(mapRow);
}

export async function getMemberById(id: number): Promise<Member | null> {
  const rows = await queryRows<MemberRow[]>(
    `SELECT ${MEMBER_COLUMNS} FROM members WHERE id = ? LIMIT 1`,
    [id],
  );
  if (!rows.length) return null;
  return mapRow(rows[0]);
}

export async function createMember(payload: MemberPayload) {
  const result = await execute(
    `INSERT INTO members (full_name, membership_type, status, start_date, end_date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      payload.fullName,
      payload.membershipType,
      payload.status,
      payload.startDate,
      payload.endDate ?? null,
    ],
  );

  const created = await getMemberById(result.insertId);
  if (!created) {
    throw new Error("Unable to load newly created member.");
  }

  return created;
}

export async function updateMember(id: number, payload: MemberPayload) {
  await execute(
    `UPDATE members
     SET full_name = ?, membership_type = ?, status = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [
      payload.fullName,
      payload.membershipType,
      payload.status,
      payload.startDate,
      payload.endDate ?? null,
      id,
    ],
  );

  const updated = await getMemberById(id);
  if (!updated) {
    throw new Error("Member not found after update.");
  }

  return updated;
}

export async function deleteMember(id: number) {
  await execute("DELETE FROM members WHERE id = ?", [id]);
}

