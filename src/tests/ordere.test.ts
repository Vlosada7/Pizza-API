import request from "supertest";
import { describe } from "node:test";
import { prisma } from "../../database";

const mockOrder = {
	pizzaId: "19111e99-080d-4a0d-a852-d6f203edd3fc",
	pizzaQuantity: 7,
};

const URL = "http://localhost:3002";

describe("getAllOrderes", () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("Should return all orderes and status 200", async () => {
		const response = await request(URL).get("/orders");
		const orders = await prisma.order.findMany();
		if (orders.length === 0) {
			expect(response.status).toBe(204);
			expect(response.body).toEqual("No orderes yet");
		} else {
			expect(response.status).toBe(200);
			expect(response.body).toEqual(orders);
		}
	});
});

describe("newOrderer", () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});
	it("Should return 400 if dont pass pizzaId", async () => {
		const response = await request(URL).put("/order").send({
			pizzaQuantity: 2,
		});
		expect(response.status).toBe(400);
	});
	it("Should return 400 if dont pass pizzaQuantity", async () => {
		const response = await request(URL).put("/order").send({
			pizzaId: "423eb19d-4fa6-4e48-b252-3ab65f7bed58",
		});
		expect(response.status).toBe(400);
	});
	it("Should return 201 if passed both arguments", async () => {
		const response = await request(URL).put("/order").send(mockOrder);
		expect(response.status).toBe(201);
    expect(response.body.pizzaId).toEqual(mockOrder.pizzaId);
    expect(response.body.quantity).toEqual(mockOrder.pizzaQuantity);
	});
	it("Should respect the index ordere", async () => {
		const orderes = await prisma.order.findMany();
		if (orderes.length == 0) {
			const res = await request(URL).put("/order").send(mockOrder);
			const newOrderer = res.body.orderId;
			const lastSalesman = newOrderer.salesmanId;
			const lastSalesmanIndex = lastSalesman.round_robin_index;
			expect(lastSalesmanIndex).toEqual(1);
		} else {
			const lastOrder = orderes[orderes.length - 1];
			const lastSalesman = lastOrder.salesmanId;
			const lastSalesmanIndex = await prisma.salesman.findUnique({
				where: {
					id: lastSalesman,
				},
			});
			const penultimateOrder = orderes[orderes.length - 2];
			const penultimateSalesman = penultimateOrder.salesmanId;
			const penultimateSalesmanIndex = await prisma.salesman.findUnique({
				where: {
					id: penultimateSalesman,
				},
			});
			if (penultimateSalesmanIndex) {
				if (penultimateSalesmanIndex?.round_robin_index === 6) {
					expect(lastSalesmanIndex?.round_robin_index).toBe(1);
				} else {
					expect(lastSalesmanIndex?.round_robin_index).toBe(
						penultimateSalesmanIndex?.round_robin_index + 1
					);
				}
			}
		}
	});
});

describe("getOrdererId", () => {
	afterAll(async () => {
		await prisma.$disconnect();
	});
	it("Should return the specific order", async () => {
    const orderes = await prisma.orderItem.findMany();
    const lastOrder = orderes[orderes.length - 1];
    const lastOrderId = lastOrder.id;
		const res = await request(URL).get(`/order/${lastOrderId}`);
		expect(res.status).toBe(200);
		expect(res.body.id).toEqual(lastOrderId);
	});
  it('Should return error if no id is passed', async () => {
    const res = await request(URL).get('/order/');
    expect(res.status).toBe(404);
  })
});