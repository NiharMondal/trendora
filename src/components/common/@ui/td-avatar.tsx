import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type TDAvatarProps = {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
    fallback?: string;
};

export default function TdAvatar({
    src,
    alt,
    size = "md",
    fallback = "U",
}: TDAvatarProps) {
    const avatarSize = {
        sm: "size-8",
        md: "size-12",
        lg: "size-16",
    };
    return (
        <Avatar className={cn(avatarSize[size])}>
            <AvatarImage
                src={src}
                alt={alt}
                className="object-center object-cover w-full h-full rounded-full"
            />
            <AvatarFallback className="rounded-full">{fallback}</AvatarFallback>
        </Avatar>
    );
}
