type TMetaData = {
	currentPage: number;
	totalPages: number;
	totalData: number;
};

export type TServerResponse<T> = {
	success: boolean;
	message: string;
	meta?: TMetaData;
	result: T;
};
