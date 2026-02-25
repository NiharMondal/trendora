type TMetaData = {
	currentPage: number;
	totalPages: number;
	totalData: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type TServerResponse<T> = {
	success: boolean;
	message: string;
	meta?: TMetaData;
	result: T;
};
