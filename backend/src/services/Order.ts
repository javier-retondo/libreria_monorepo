import { FindOptions, Op, WhereOptions } from 'sequelize';
import sequelize from '../database';
import {
  IOrder,
  IOrderItem,
  Order,
  OrderItem,
  OrderStatus,
  User,
} from '../models';
import ejs from 'ejs';
import sendEmail from '../utils/mailer';
import { getUserById } from './User';
import { join } from 'path';

const createOrder = async (
  orderData: IOrder,
  items: Omit<IOrderItem, 'orden_id'>[],
): Promise<IOrder> => {
  const transaction = await sequelize.transaction();
  const order = await Order.create(orderData, { transaction });
  if (!order || !order.dataValues || !order.dataValues.id) {
    await transaction.rollback();
    throw new Error('Error creating order');
  }
  const orderItems = await OrderItem.bulkCreate(
    items.map((item) => ({
      ...item,
      orden_id: order.dataValues.id as number,
    })),
    { transaction },
  );

  if (!orderItems || orderItems.length === 0) {
    await transaction.rollback();
    throw new Error('Error creating order items');
  }
  await transaction.commit();

  const user = await getUserById(order.dataValues.usuario_id);

  const orderCompleteData: IOrder = await getOrderById(
    order.dataValues.id as number,
  );

  const total =
    orderCompleteData && orderCompleteData.items
      ? orderCompleteData.items.reduce(
          (acc, i) => acc + i.precio * i.cantidad,
          0,
        )
      : 0;

  const dataMail = {
    nombreUsuario: user?.nombre || 'Usuario',
    baseUrl: process.env.BASE_URL || 'http://localhost:3001',
    pedido: {
      id: orderCompleteData.id,
      fecha: new Date(orderCompleteData.fecha).toLocaleDateString(),
      provincia: orderCompleteData.provincia,
      direccion: orderCompleteData.direccion,
      detalles: orderCompleteData.detalles || 'Sin detalles',
      items: orderCompleteData.items,
    },
    total,
  };
  const html = await ejs.renderFile(join('templates', 'order.ejs'), dataMail);
  user && (await sendEmail(user.email, 'Detalles de tu Pedido', html));

  return await getOrderById(order.dataValues.id as number);
};

const getOrderById = async (id: number): Promise<IOrder> => {
  const order = await Order.findByPk(id, {
    include: [
      { model: OrderItem, as: 'items', include: ['libro'] },
      { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
    ],
  });
  if (!order) {
    console.error(`Order with ID ${id} not found`);
    throw new Error(`Order with ID ${id} not found`);
  }
  return order.toJSON() as IOrder;
};

const getOrders = async (
  pagination: {
    page: number;
    pageSize: number;
    sortBy: keyof IOrder;
    sortOrder: 'ASC' | 'DESC';
  },
  estado?: OrderStatus,
  usuario_id?: number[],
  libro_id?: number[],
  date?: Date,
): Promise<{
  rows: IOrder[];
  count: number;
}> => {
  const {
    page = 1,
    pageSize = 10000,
    sortBy = 'id',
    sortOrder = 'ASC',
  } = pagination;

  const where: WhereOptions<IOrder> = {};

  if (usuario_id && usuario_id.length > 0) {
    where['usuario_id'] = usuario_id;
  }

  if (estado) {
    where['estado'] = estado;
  }

  if (date) {
    where['fecha'] = { [Op.eq]: date };
  }

  let ordersIds: number[] = [];

  const attributes: FindOptions<IOrder>['attributes'] =
    sortBy !== 'id' ? ['id', sortBy] : ['id'];

  const ordersCount = await Order.findAndCountAll({
    where,
    attributes,
    include: libro_id
      ? [
          {
            model: OrderItem,
            as: 'items',
            attributes: [],

            where: [
              {
                libro_id: { [Op.in]: libro_id },
              },
            ],
          },
        ]
      : [],
    order: [[sortBy, sortOrder]],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  ordersIds = ordersCount.rows
    .filter(
      (order) =>
        order &&
        order.dataValues.id !== null &&
        order.dataValues.id !== undefined,
    )
    .map((order) => order.dataValues.id)
    .filter((id): id is number => typeof id === 'number');

  const orders = await Order.findAndCountAll({
    where: { id: { [Op.in]: ordersIds } },
    order: [[sortBy, sortOrder]],
    include: [
      {
        model: OrderItem,
        as: 'items',
        required: false,
        separate: true,
        include: ['libro'],
      },
      {
        model: User,
        as: 'usuario',
      },
    ],
  });

  return {
    rows: orders.rows.map((order) => order.dataValues),
    count: ordersCount.count,
  };
};

const updateStatus = async (
  id: number,
  estado: OrderStatus.COMPLETED | OrderStatus.CANCELED,
): Promise<IOrder> => {
  const order = await Order.findByPk(id);
  if (order?.dataValues.estado !== OrderStatus.PENDING) {
    throw new Error("El estado de la orden tiene que ser 'pendiente'");
  }

  await order.update({ estado });

  const orderCompleteData: IOrder = await getOrderById(id);

  const html = await ejs.renderFile(join('templates', 'confirmation.ejs'), {
    pedido: orderCompleteData,
    estado: estado,
    baseUrl: process.env.BASE_URL || 'http://localhost:3001',
    mensaje:
      estado === OrderStatus.COMPLETED
        ? '¡Tu pedido ha sido completado y se encuentra en proceso de envío!'
        : 'Tu pedido ha sido cancelado.',
  });

  const user = await getUserById(order.dataValues.usuario_id);

  user && (await sendEmail(user.email, 'Confirmación de Pedido', html));

  return order.dataValues;
};

export { createOrder, getOrderById, getOrders, updateStatus };
