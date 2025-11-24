export type MemberStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export interface Member {
  id: number;
  fullName: string;
  membershipType: string;
  status: MemberStatus;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

export type MemberPayload = {
  fullName: string;
  membershipType: string;
  status: MemberStatus;
  startDate: string;
  endDate?: string | null;
};

