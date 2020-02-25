<a name="module_db"></a>

## db

- [db](#module_db)
  - _static_
    - [.query(sql)](#module_db.query) ⇒ <code>Promise</code>
  - _inner_
    - [~getClient()](#module_db..getClient2) ⇒ <code>Promise</code>
    - [~getClient(callback)](#module_db..getClient)

<a name="module_db.query"></a>

### db.query(sql) ⇒ <code>Promise</code>

Execute a query on the database pool.

**Kind**: static method of [<code>db</code>](#module_db)  
**Returns**: <code>Promise</code> - The query result  
**Throws**:

- <code>Error</code>

| Param      | Type                | Description                                        |
| ---------- | ------------------- | -------------------------------------------------- |
| sql        | <code>Object</code> | The object containing the query string and values. |
| sql.text   | <code>string</code> | The query string.                                  |
| sql.values | <code>array</code>  | The query parameter(s)                             |

<a name="module_db..getClient2"></a>

### db~getClient() ⇒ <code>Promise</code>

Get the client from the pool.

**Kind**: inner method of [<code>db</code>](#module_db)  
<a name="module_db..getClient"></a>

### db~getClient(callback)

Get the client from the pool.

**Kind**: inner method of [<code>db</code>](#module_db)

| Param    | Type                  | Description                          |
| -------- | --------------------- | ------------------------------------ |
| callback | <code>function</code> | The function to run with the client. |
