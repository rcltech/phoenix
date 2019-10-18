const bookings = async (parent, {data} , ctx) => {
  return ctx.prisma.bookings({where: data})
};

const rooms = (parent, {data}, ctx) =>
  ctx.prisma.rooms(data);

export {bookings, rooms};
