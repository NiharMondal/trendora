import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

export default function TDSeparator({ className }: Props) {
    return <hr className={cn("border-t border-muted my-5", className)} />;
}
