import { describe, expect, beforeAll, afterAll } from "@jest/globals";
import request from 'supertest';
import { prisma } from "../../database";
import app from "..";


describe('getAllOrderes', () => {
  afterAll(async () => {
    // Limpa os dados de teste do banco de dados após todos os testes serem concluídos
    // await prisma.order.deleteMany();
    await prisma.$disconnect();
  });

  it('deve retornar todas as ordens com o status 200', async () => {
    // Cria ordens fictícias no banco de dados para testar a rota
    // const order1 = await prisma.order.create({ data: { /* Dados da ordem 1 */ } });
    // const order2 = await prisma.order.create({ data: { /* Dados da ordem 2 */ } });

    // Faz uma solicitação GET para a rota do controlador
    const response = await request(app).get('/orders');
    const orders = await prisma.order.findMany();

    // Verifica se a resposta tem o status 200 OK
    expect(response.status).toBe(200);

    // Verifica se a resposta contém as ordens criadas no banco de dados
    expect(response.body).toEqual(orders);
  });

  it('deve lidar com erros e retornar status 500', async () => {
    // Simula um erro ocorrendo durante a busca das ordens
    jest.spyOn(prisma.order, 'findMany').mockRejectedValueOnce(new Error('Erro simulado'));

    // Faz uma solicitação GET para a rota do controlador
    const response = await request(app).get('/orders');

    // Verifica se a resposta tem o status 500 Internal Server Error
    expect(response.status).toBe(500);

    // Verifica se a resposta contém a mensagem de erro esperada
    expect(response.body).toEqual({ message: 'Unexpected API error' });
  });
});
