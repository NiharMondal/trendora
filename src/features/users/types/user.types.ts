export type TUser = {
	id: string;
	name: string;
	// `null` for an account with no `Auth` row — it cannot sign in at all.
	email: string | null;
	phone: string;
	role: string | null;
	avatar: string;
	avatarPublicId: string;
	createdAt: string;
	updatedAt: string;
};
