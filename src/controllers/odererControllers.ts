import { Request, Response } from "express";
import { prisma } from "../../database";

const getAllOrderes = async (req: Request, res: Response) => {
	try {
		const orderes = await prisma.order.findMany();
		res.status(200).send(orderes);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Unexpected API error" });
	}
};

const getOrdererId = async (req: Request, res: Response) => {
	if (req.params.id != null) {
		try {
			const order = await prisma.order.findUnique({
				where: {
					id: req.params.id,
				},
			});
			res.status(200).send(order);
		} catch (error) {
			console.error(error);
			res.status(500).send({ message: "Unexpected API error" });
		}
	} else {
		res
			.status(400)
			.json({
				message:
					"Parameter missing to find orderer.",
			});
	}
};

const newOrderer = async (req: Request, res: Response) => {
	res.status(202).send("New orderer check");
};

const thankYouEmail = async (req: Request, res: Response) => {
	res.status(202).send("Send email check");
};

export { getAllOrderes, getOrdererId, newOrderer, thankYouEmail };
