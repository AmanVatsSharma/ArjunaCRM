import { type AvatarType } from 'arjuna-ui/display';
export type ObjectRecordIdentifier = {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarType?: AvatarType | null;
  linkToShowPage?: string;
};
