import { Request, Response } from "express";

import { prisma } from "../../database";

const getAllOrderes = async (req: Request, res: Response) => {
	const orderes = await prisma.order.findMany();
	res.status(200).send(orderes);
};

const getOrdererId = async (req: Request, res: Response) => {
	const order = await prisma.order.findUnique({
		where: {
			id: req.params.id,
		},
	});
	res.status(200).send(order);
};

const newOrderer = async (req: Request, res: Response) => {
	res.status(202).send("New orderer check");
};

const thankYouEmail = async (req: Request, res: Response) => {
	res.status(202).send("Send email check");
};

export { getAllOrderes, getOrdererId, newOrderer, thankYouEmail };
