import { User } from "@repo/utils";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type MembershipTier = "bronze" | "silver" | "gold" | "platinum";

export interface ExtendedProfileFields {
  phone: string;
  gender: Gender;
  birthday: string;
}

export interface ProfileStats {
  totalPoints: number;
  totalOrders: number;
  totalSpent: number;
  membershipTier: MembershipTier;
  nextTierPoints: number;
}

export interface PersonalInfoForm {
  fullName: string;
  email: string;
  phone: string;
  image: string;
  gender: Gender;
  birthday: string;
}

export interface UserProfile extends User {
  phone?: string;
  gender?: Gender;
  birthday?: string;
}

export const MEMBERSHIP_LABELS: Record<MembershipTier, string> = {
  bronze: "Bronze Member",
  silver: "Silver Member",
  gold: "Gold Member",
  platinum: "Platinum Member",
};
