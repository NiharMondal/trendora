import { productsImage } from "./image";
export const demoImages = [
	"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
	"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZHJlc3N8ZW58MHx8MHx8fDA%3D",
	"https://images.unsplash.com/photo-1533659828870-95ee305cee3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRyZXNzfGVufDB8fDB8fHww",
];

export const variants = [
	{
		size: "lg",
		price: 32.54,
		color: "Black",
		stock: 45,
		image: productsImage.black,
	},
	{
		size: "md",
		price: 42.54,
		color: "Gray",
		stock: 55,
		image: productsImage.gray,
	},
	{
		size: "sm",
		price: 27.54,
		color: "Silver",
		stock: 15,
		image: productsImage.silver,
	},
	{
		size: "2xl",
		price: 28.54,
		color: "Red",
		stock: 95,
		image: productsImage.red,
	},
];
export const products = [
	{
		name: "Clothing and accessory boutiques for sale",
		slug: "clothing-and-accessory",
		basePrice: 43.67,
		productVariants: [
			{
				size: "lg",
				price: 32.54,
				color: "Black",
				stock: 45,
				image: productsImage.black,
			},
			{
				size: "md",
				price: 42.54,
				color: "Gray",
				stock: 55,
				image: productsImage.gray,
			},
			{
				size: "sm",
				price: 27.54,
				color: "Silver",
				stock: 15,
				image: productsImage.silver,
			},
			{
				size: "2xl",
				price: 28.54,
				color: "Red",
				stock: 95,
				image: productsImage.red,
			},
		],
	},
	{
		name: " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima, excepturi!",
		slug: "lorem-ipsum-dolor",
		basePrice: 32.67,
		productVariants: [
			{
				size: "lg",
				price: 32.54,
				color: "Yellow",
				stock: 55,
				image: productsImage.yellow,
			},
			{
				size: "md",
				price: 42.54,
				color: "Red",
				stock: 78,
				image: productsImage.red,
			},
			{
				size: "sm",
				price: 27.54,
				color: "White",
				stock: 20,
				image: productsImage.white,
			},
			{
				size: "xl",
				price: 28.54,
				color: "Gray",
				stock: 55,
				image: productsImage.gray,
			},
		],
	},
	{
		name: "Lorem ipsum dolor sit amet.",
		basePrice: 23.67,
		slug: "amet-lorem",
	},
];

export const productSizes = [
	{ label: "XS", value: "XS" },
	{ label: "S", value: "S" },
	{ label: "M", value: "M" },
	{ label: "L", value: "L" },
	{ label: "XL", value: "XL" },
	{ label: "2XL", value: "2XL" },
	{ label: "3XL", value: "3XL" },
];
