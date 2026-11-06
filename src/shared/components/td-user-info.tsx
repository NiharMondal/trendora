import TdAvatar from "@/shared/components/td-avatar";
import { cn } from "@/shared/lib/utils";

type TdUserInfoProps = {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    size?: "sm" | "md" | "lg";
    /** Shown when `name` is missing, e.g. "A buyer". */
    nameFallback?: string;
    className?: string;
};

/** Avatar + name + optional email — the "who" cell used across tables. */
export default function TdUserInfo({
    name,
    email,
    avatar,
    size = "md",
    nameFallback = "Unknown user",
    className,
}: TdUserInfoProps) {
    const displayName = name || nameFallback;

    return (
        <div className={cn("flex items-center gap-x-3", className)}>
            <TdAvatar
                src={avatar || undefined}
                alt={displayName}
                size={size}
                fallback={displayName.charAt(0).toUpperCase()}
                className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-muted bg-muted"
            />
            <div className="min-w-0 space-y-0.5">
                <p className="truncate font-medium">{displayName}</p>
                {email && (
                    <p className="truncate text-xs text-muted-foreground">
                        {email}
                    </p>
                )}
            </div>
        </div>
    );
}
