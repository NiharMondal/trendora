import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export default function NewComments() {
	return (
		<div className="bg-white rounded-2xl shadow-2xl p-5">
			<h4 className="mb-10 font-semibold text-black">New Comments</h4>
			<div className="space-y-3">
				<div className="flex gap-x-2">
					<Avatar className="size-10 rounded-full overflow-hidden">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="">
						<p>Nihar Mondal</p>
						<p>Star * * *</p>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Et odio sed fugiat distinctio cupiditate fugit
							officia iste veniam placeat, earum assumenda rerum
							consequuntur quia. Nihil ipsam dolores reiciendis
							rem porro!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
