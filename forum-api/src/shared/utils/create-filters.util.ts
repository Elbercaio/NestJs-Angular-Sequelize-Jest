/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Op } from 'sequelize';

export interface FilterObject {
  [key: string]: any;
}

const isNaN = (param): boolean => typeof param === 'string';

export const createFilters = (filters, ignoreRelation = [], acceptFalsy = []): FilterObject => {
  const where = [];
  for (const key in filters) {
    if (filters.hasOwnProperty(key) && !ignoreRelation.includes(key) && filters[key]) {
      const item = {};
      const element = filters[key];
      item[key] = isNaN(element) ? { [Op.like]: `%${element}%` } : { [Op.eq]: element };
      where.push(item);
    } else if (filters.hasOwnProperty(key) && !ignoreRelation.includes(key) && acceptFalsy.includes(key)) {
      const item = {};
      const element = filters[key];
      item[key] = isNaN(element) ? { [Op.like]: `%${element}%` } : { [Op.eq]: element };
      where.push(item);
    }
  }

  return {
    [Op.and]: where,
  };
};
