export type TUser = {
	id: string;
	name: string;
	// `null` for an account with no `Auth` row — it cannot sign in at all.
	email: string | null;
	phone: string;
	role: string | null;
	avatar: string;
	avatarPublicId: string;
	/** A disabled account: cannot sign in, and a seller's store is suspended with it. */
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};

/**
 * Roles an admin may assign from the user table. VENDOR is left out on
 * purpose: `PATCH /users/:id/role` only accepts it for an account whose store
 * is already approved, and store approval sets it anyway.
 */
export type TAssignableRole = "CUSTOMER" | "ADMIN";
