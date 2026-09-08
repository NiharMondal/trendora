/**
 * Mirrors the backend `Role` enum (`prisma/schema.prisma` +
 * `src/helpers/enum.ts`). All three must stay in sync.
 *
 * NOTE: `SUPER_ADMIN` does **not** exist on the backend — its `Role` is only
 * `CUSTOMER | VENDOR | ADMIN`, so no JWT will ever carry it. It is kept here
 * because existing admin checks reference it, and treating it as an admin
 * costs nothing; do not add new behaviour that depends on it.
 */
export enum EnumUserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    VENDOR = "VENDOR",
    CUSTOMER = "CUSTOMER",
}
