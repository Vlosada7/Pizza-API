import { describe, expect, beforeAll, afterAll } from "@jest/globals";
import request from 'supertest';
import { prisma } from "../../database";
import app from "..";


describe('getAllOrderes', () => {
  afterAll(async () => {

    await prisma.$disconnect();
  });

  it('deve retornar todas as ordens com o status 200', async () => {

    const response = await request(app).get('/orders');
    const orders = await prisma.order.findMany();


    expect(response.status).toBe(200);


    expect(response.body).toEqual(orders);
  });

  it('deve lidar com erros e retornar status 500', async () => {

    jest.spyOn(prisma.order, 'findMany').mockRejectedValueOnce(new Error('Erro simulado'));

   
    const response = await request(app).get('/orders');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Unexpected API error' });
  });
});
