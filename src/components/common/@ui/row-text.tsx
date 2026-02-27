import { cn } from "@/lib/utils";

type TRowTextProps = {
	title: string;
	value: string | number | undefined;
    className?:string;
	titleClassName?:string;
};
export default function RowText({ title, value , className, titleClassName}: TRowTextProps) {
	return (
		<ul className={cn("flex items-center justify-between w-full", className)}>
			<li className={cn(titleClassName)}>{title}</li>
			<li>{value}</li>
		</ul>
	);
}
