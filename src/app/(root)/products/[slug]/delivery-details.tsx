import TextWithIcon from "@/components/common/@ui/text-with-icon";
import {
    Ambulance,
    CircleQuestionMark,
    Clock,
    MapPin,
    RotateCcw,
    Share2,
} from "lucide-react";

export default function DeliveryDetails() {
    return (
        <div className="space-y-2  text-sm">
            <div className="flex items-center gap-x-3 divide-x ">
                <TextWithIcon
                    icon={<Ambulance className="size-5" />}
                    text="Delivery & Return"
                    className="pr-3"
                />
                <TextWithIcon
                    icon={<CircleQuestionMark className="size-5" />}
                    text="Delivery & Return"
                    className="pr-3"
                />
                <TextWithIcon
                    icon={<Share2 className="size-5" />}
                    text="Delivery & Return"
                />
            </div>

            <TextWithIcon
                icon={<Clock className="size-5" />}
                text="Delivery & Return: 12-26 days(International), 2-6 days(Bangladesh)"
            />
            <TextWithIcon
                icon={<RotateCcw className="size-5" />}
                text="Return within 45 days of purchase. Duties & taxes are non-refundable."
            />
            <TextWithIcon
                icon={<MapPin className="size-5" />}
                text="View Store Information"
                className="hover:underline hover:text-accent cursor-pointer max-w-fit"
            />
        </div>
    );
}
