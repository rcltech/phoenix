const bookings = async (parent, {data} , ctx) => {
  return ctx.prisma.bookings({where: data, orderBy: 'start_ASC'})
};

const rooms = (parent, {data}, ctx) =>
  ctx.prisma.rooms(data);

export {bookings, rooms};
