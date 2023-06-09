import { Request, Response } from "express";
import { prisma } from "../../database";
import nodemailer from "nodemailer";

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
	if (req.params.id) {
		try {
			const order = await prisma.orderItem.findUnique({
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
		res.status(400).json({
			message: "Parameter missing to find orderer.",
		});
	}
};

const newOrderer = async (req: Request, res: Response) => {
	try {
		const { pizzaId, pizzaQuantity } = req.body;
		if (!pizzaId || !pizzaQuantity) {
			res.status(400).send("Missing pizzaId or pizzaQuantity");
			return;
		}

		const orderes = await prisma.order.findMany();
		if (orderes.length === 0) {
			const salesman = await prisma.salesman.findFirst({
				where: {
					round_robin_index: 1,
				},
			});

			if (!salesman) {
				res.status(404).send("No salesman in database");
				return;
			}

			const newOrderer = await prisma.order.create({
				data: {
					salesmanId: salesman.id,
				},
			});

			const newOrdererItem = await prisma.orderItem.create({
				data: {
					pizzaId,
					orderId: newOrderer.id,
					quantity: pizzaQuantity,
				},
			});

			res.status(201).send(newOrdererItem);
		} else {
			const lastOrder = orderes[orderes.length - 1];
			const lastSalesmanId = lastOrder.salesmanId;
			const lastSalesman = await prisma.salesman.findUnique({
				where: {
					id: lastSalesmanId,
				},
			});

			if (!lastSalesman) {
				res.status(404).send("No salesman in database");
				return;
			}

			let nextSalesmanIndex = lastSalesman.round_robin_index + 1;
			if (nextSalesmanIndex > 6) {
				nextSalesmanIndex = 1;
			}
			const nextSalesman = await prisma.salesman.findFirst({
				where: {
					round_robin_index: nextSalesmanIndex,
				},
			});

			if (!nextSalesman) {
				res.status(404).send("No salesman in database");
				return;
			}

			const newOrderer = await prisma.order.create({
				data: {
					salesmanId: nextSalesman.id,
				},
			});

			const newOrdererItem = await prisma.orderItem.create({
				data: {
					pizzaId,
					orderId: newOrderer.id,
					quantity: pizzaQuantity,
				},
			});

			res.status(201).send(newOrdererItem);
		}
	} catch (error) {
		console.error("Error in newOrderer:", error);
		res.status(500).send("Internal Server Error");
	}
};

const thankYouEmail = async (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ error: "Email address is required" });
	}

	const transporter = nodemailer.createTransport({
		host: "smtp.mailgun.org",
		port: 587,
		secure: false,
		auth: {
			user: "postmaster@sandboxadeeec3344ab4c7994fb26346cdb1a84.mailgun.org",
			pass: "0cf6cb09bd71bd558ec3f0a9f3dca2fa-6d1c649a-c08fa892",
		},
	});

	const mailOptions = {
		from: "postmaster@sandboxadeeec3344ab4c7994fb26346cdb1a84.mailgun.org",
		to: email,
		subject: "Thank You for Your Order",
		text: "Thank you for your order. We appreciate your business!",
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
			return res.status(500).send({ error: "Error sending email" });
		}
		console.log("Email sent:", info.response);
		res.status(200).send({ message: "Email sent successfully" });
	});
};

export { getAllOrderes, getOrdererId, newOrderer, thankYouEmail };
