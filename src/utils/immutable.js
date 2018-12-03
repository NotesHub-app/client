import * as Immutable from 'immutable';

/**
 * Конвертация List в Map  с указанием ключевого поля
 * @param list
 * @param keyField
 * @returns {Immutable.Map}
 */
export function listToMap(list, keyField = 'id') {
    // Если на входе уже Map - возвращаем обратно как есть
    if (list instanceof Immutable.Map) {
        return list;
    }
    let result = new Immutable.Map();
    list.forEach(listItem => {
        result = result.set(listItem.get(keyField), listItem);
    });

    return result;
}
