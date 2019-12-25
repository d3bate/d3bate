export const findItem = (item, list) => {
    return list.findIndex(o => {
        return o.id === item.id
    });
};