import { Backend, PgBackend } from './backend';
import { CollectionToken, ParameterToken, SeparatorToken, StringToken } from '../tokens';
import { DeleteQuery, InsertQuery, PartialQuery, SelectQuery, UpdateQuery } from '../query';
import { SplitOptionalAndRequired, toType } from '../types';

import { ColumnWrapper } from '../columns';
import { Table } from '../table';
import type {StandardOptions, SharedPoolOptions} from "./backend/pg";
import { Pool } from 'pg';

interface TableMap {
  [tableName: string]: any;
}

export class InternalDatabase<UserDefinedTables> {
  private backend: Backend;
  private tables: { [tableName: string]: Table<any, any, any> } = {};

  constructor(backend: Backend, tables: { [tableName: string]: Table<any, any, any> }) {
    this.tables = tables;
    this.backend = backend;

    this.defineGetters();
  }

  /** @internal */
  getTable(tableName: string) {
    return this.tables[tableName];
  }

  /** @internal */
  getTableNames() {
    return Object.keys(this.tables);
  }

  private defineGetters() {
    const tableNames = Object.keys(this.tables);

    tableNames.forEach(tableName => {
      Object.defineProperty(this, tableName, {
        get() {
          const table = this.tables[tableName];

          table.init(this);

          return table;
        },
      });
    });
  }

  transaction = <Callback extends (db: this) => Promise<any>>(callback: Callback): Promise<any> => {
    return this.backend.transaction(backend => {
      const db = new InternalDatabase(backend, this.tables);

      return Promise.resolve(callback(db as any));
    });
  };

  destroy = () => {
    return this.backend.destroy();
  };

  exec = <T>(query: string, parameters?: any[]) => {
    // TODO: let's make this as deprecated in favor of this#sql``.

    return this.backend.query<T>(query, parameters);
  };

  sql = <T>(strings: TemplateStringsArray, ...parameters: any[]) => {
    const text = strings.reduce(
      (query, string, index) =>
        query + string + (index < parameters.length ? `$${String(index + 1)}` : ``),
      ``,
    );

    return this.backend.query<T>(text, parameters);
  };

  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> }
  >(
    columnA: A,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> }
  >(
    columnA: A,
    columnB: B,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    I extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> } &
      { [P in I['name']]: toType<I['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
    columnI: I,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    I extends ColumnWrapper<any, any, any, any, any>,
    J extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> } &
      { [P in I['name']]: toType<I['selectType']> } &
      { [P in J['name']]: toType<J['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
    columnI: I,
    columnJ: J,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    I extends ColumnWrapper<any, any, any, any, any>,
    J extends ColumnWrapper<any, any, any, any, any>,
    K extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> } &
      { [P in I['name']]: toType<I['selectType']> } &
      { [P in J['name']]: toType<J['selectType']> } &
      { [P in K['name']]: toType<K['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
    columnI: I,
    columnJ: J,
    columnK: K,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    I extends ColumnWrapper<any, any, any, any, any>,
    J extends ColumnWrapper<any, any, any, any, any>,
    K extends ColumnWrapper<any, any, any, any, any>,
    L extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> } &
      { [P in I['name']]: toType<I['selectType']> } &
      { [P in J['name']]: toType<J['selectType']> } &
      { [P in K['name']]: toType<K['selectType']> } &
      { [P in L['name']]: toType<K['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
    columnI: I,
    columnJ: J,
    columnK: K,
    columnL: L,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select<
    A extends ColumnWrapper<any, any, any, any, any>,
    B extends ColumnWrapper<any, any, any, any, any>,
    C extends ColumnWrapper<any, any, any, any, any>,
    D extends ColumnWrapper<any, any, any, any, any>,
    E extends ColumnWrapper<any, any, any, any, any>,
    F extends ColumnWrapper<any, any, any, any, any>,
    G extends ColumnWrapper<any, any, any, any, any>,
    H extends ColumnWrapper<any, any, any, any, any>,
    I extends ColumnWrapper<any, any, any, any, any>,
    J extends ColumnWrapper<any, any, any, any, any>,
    K extends ColumnWrapper<any, any, any, any, any>,
    L extends ColumnWrapper<any, any, any, any, any>,
    M extends ColumnWrapper<any, any, any, any, any>,
    Ret = { [P in A['name']]: toType<A['selectType']> } &
      { [P in B['name']]: toType<B['selectType']> } &
      { [P in C['name']]: toType<C['selectType']> } &
      { [P in D['name']]: toType<D['selectType']> } &
      { [P in E['name']]: toType<E['selectType']> } &
      { [P in F['name']]: toType<F['selectType']> } &
      { [P in G['name']]: toType<G['selectType']> } &
      { [P in H['name']]: toType<H['selectType']> } &
      { [P in I['name']]: toType<I['selectType']> } &
      { [P in J['name']]: toType<J['selectType']> } &
      { [P in K['name']]: toType<K['selectType']> } &
      { [P in L['name']]: toType<K['selectType']> } &
      { [P in M['name']]: toType<K['selectType']> }
  >(
    columnA: A,
    columnB: B,
    columnC: C,
    columnD: D,
    columnE: E,
    columnF: F,
    columnG: G,
    columnH: H,
    columnI: I,
    columnJ: J,
    columnK: K,
    columnL: L,
    columnM: M,
  ): {
    from(table: Table<any, any, any>): SelectQuery<any, {}, {}, {}, Ret[], Ret>;
  };
  select(this: Database<UserDefinedTables>, ...columns: ColumnWrapper<any, any, any, any, any>[]) {
    const columnsMap = columns.reduce(
      (map, column) => ({
        ...map,
        [column.getNameInResultSet()]: column.getCamelCaseName(),
      }),
      {},
    );

    return {
      from: <TW extends Table<any, any, any>>(table: TW) =>
        new SelectQuery(
          this,
          columnsMap,
          new StringToken(`SELECT`),
          new SeparatorToken(
            `,`,
            columns
              .filter(column => Boolean(column))
              .map(column => new CollectionToken(column!.toTokens())),
          ),
        ).from(table),
    };
  }

  insertInto<T extends Table<any, any, any>>(
    table: T,
  ): InsertQuery<
    Database<UserDefinedTables>,
    T,
    T['$row'],
    T['$insertRow'],
    T['$updateRow'],
    number,
    void
  > {
    return new InsertQuery(
      (this as unknown) as Database<UserDefinedTables>,
      table,
      new StringToken(`INSERT INTO`),
      new StringToken(table.getName()),
    );
  }

  deleteFrom<T extends Table<any, any, any>>(
    table: T,
  ): DeleteQuery<
    Database<UserDefinedTables>,
    T,
    T['$row'],
    T['$insertRow'],
    T['$updateRow'],
    number,
    void
  > {
    return new DeleteQuery(
      (this as unknown) as Database<UserDefinedTables>,
      table,
      new StringToken(`DELETE FROM`),
      new StringToken(table.getName()),
    );
  }

  update<
    T extends Table<any, any, any>,
    Ret = UpdateQuery<
      Database<UserDefinedTables>,
      T,
      T['$row'],
      T['$insertRow'],
      T['$updateRow'],
      number,
      void
    >
  >(
    table: T,
  ): {
    set(object: { [P in keyof T['$updateRow']]?: toType<T['$updateRow'][P]> | PartialQuery }): Ret;
  } {
    const getColumn = (
      key: string | number | symbol,
    ): ColumnWrapper<any, any, any, any, any> | undefined => (table as any)[key];

    const self: Database<UserDefinedTables> = this as any;
    return {
      set(object: { [P in keyof T['$updateRow']]?: T['$updateRow'][P] | PartialQuery }): Ret {
        const keys = Object.keys(object) as (keyof T['$row'])[];

        return new UpdateQuery(
          self,
          table,
          new StringToken(`UPDATE`),
          new StringToken(table.getName()),
          new StringToken(`SET`),
          new SeparatorToken(
            `,`,
            keys
              .map(columnName => getColumn(columnName))
              .filter(column => Boolean(column))
              .map(column => {
                const value = (object as any)[column!.camelCaseName];

                return value && value.toTokens
                  ? new CollectionToken([
                      new StringToken(column!.snakeCaseName!),
                      new StringToken(`=`),
                      ...value.toTokens(),
                    ])
                  : new CollectionToken([
                      new StringToken(column!.snakeCaseName!),
                      new StringToken(`=`),
                      new ParameterToken(value),
                    ]);
              }),
          ),
        ) as any;
      },
    };
  }
}

export type Schema<UserDefinedTables extends TableMap> = {
  [TableName in keyof UserDefinedTables]: Table<
    // Selectable columns
    {
      [ColumnName in keyof UserDefinedTables[TableName]]: toType<
        UserDefinedTables[TableName][ColumnName]['selectType']
      >;
    },
    // Insertable columns. We split the not null and nullable columns to make sure the nullable ones
    // are optional.
    SplitOptionalAndRequired<UserDefinedTables[TableName], 'insertType'>,
    // Update -- can't we just get rid of this as this is basically the regular column types but
    // everything is optional?
    SplitOptionalAndRequired<UserDefinedTables[TableName], 'updateType'>
  > &
    {
      [ColumnName in keyof UserDefinedTables[TableName]]: ColumnWrapper<
        ColumnName,
        UserDefinedTables[TableName][ColumnName]['type'],
        UserDefinedTables[TableName][ColumnName]['selectType'],
        UserDefinedTables[TableName][ColumnName]['insertType'],
        UserDefinedTables[TableName][ColumnName]['updateType']
      >;
    };
};

export type Database<T> = InternalDatabase<T> & Schema<T>;

export const createDatabase = <UserDefinedTables extends TableMap>(
  connection: string | Pool | StandardOptions | SharedPoolOptions,
  userDefinedTables: UserDefinedTables,
): Database<UserDefinedTables> => {
  if (!connection) {
    throw new Error(
      `You should pass in a databaseUrl or options object when calling createDatabase().`,
    );
  }

  const tables = Object.keys(userDefinedTables).reduce((tables, tableName) => {
    const table = userDefinedTables[tableName];

    tables[tableName] = new Table<any, any, any>(table, tableName);
    return tables;
  }, {} as { [tableName: string]: Table<any, any, any> });

  const backend = new PgBackend(connection);

  return new InternalDatabase(backend, tables) as any;
};
