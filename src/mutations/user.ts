const createUser = (
    parent,
    { username, email, image_url, phone, first_name, last_name, room_no },
    ctx
) =>
    ctx.prisma.createUser({
        username,
        email,
        image_url,
        phone,
        first_name,
        last_name,
        room_no,
    });

const deleteUser = (parent, { username }, ctx) =>
    ctx.prisma.deleteUser({ username });

export { createUser, deleteUser };
