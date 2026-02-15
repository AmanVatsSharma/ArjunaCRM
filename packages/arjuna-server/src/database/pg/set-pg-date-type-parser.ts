import { types } from 'pg';

import { PG_DATE_TYPE_OID } from 'src/database/pg/constants/pg-date-type-oid.constant';

export const setPgDateTypeParser = () => {
  types.setTypeParser(PG_DATE_TYPE_OID, (value: string) => value);
};
