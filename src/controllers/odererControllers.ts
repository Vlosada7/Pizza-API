import { Request, Response } from "express";

const getAllOrderes = async (req: Request, res: Response) => {
	res.status(200).send("Get orderes check");
};

const getOrdererId = async (req: Request, res: Response) => {
	res.status(200).send("Get orderer with id check");
};

const newOrderer = async (req: Request, res: Response) => {
	res.status(202).send("New orderer check");
};

const thankYouEmail = async (req: Request, res: Response) => {
	res.status(202).send("Send email check");
};

export { getAllOrderes, getOrdererId, newOrderer, thankYouEmail };
