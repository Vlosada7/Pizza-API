import { prisma } from "../database";
import { Request, Response } from "express";

const generatePizzaAndSalesman = async (req: Request, res: Response) => {
	const pizzaData = await prisma.pizza.findMany();
	const salesmanData = await prisma.salesman.findMany();
	if (pizzaData.length === 0 && salesmanData.length === 0) {
		try {
			const pizzasToCreate = [
				{ name: "Peperonni", price: 11.25 },
				{ name: "Veggie", price: 11.6 },
				{ name: "Chicken", price: 10.7 },
				{ name: "Hawaiian", price: 12.15 },
				{ name: "Smoked Beef", price: 13 },
				{ name: "BBQ", price: 12.5 },
				{ name: "Buffalo Ranch", price: 11.35 },
				{ name: "Margherita", price: 9.5 },
			];
			const salesmanToCreate = [
				{ name: "Smith", round_robin_index: 1 },
				{ name: "Doe", round_robin_index: 3 },
				{ name: "John", round_robin_index: 4 },
				{ name: "Johnson", round_robin_index: 2 },
				{ name: "Rodriguez", round_robin_index: 5 },
				{ name: "Williams", round_robin_index: 6 },
			];
			const pizzasRecords = await prisma.pizza.createMany({
				data: pizzasToCreate,
			});
			const salesmanRecords = await prisma.salesman.createMany({
				data: salesmanToCreate,
			});
			res.status(201).send({message: "Pizzas and salesman generate", data: pizzasRecords, salesmanRecords});
		} catch (error) {
			res.status(500).send("API ERROR");
		}
	} else {
		res.status(308).send("Database already populated");
	}
	
};

export { generatePizzaAndSalesman };
