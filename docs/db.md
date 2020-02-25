<a name="module_db"></a>

## db

* [db](#module_db)
    * [.query(sql)](#module_db.query) ⇒ <code>Promise</code>
    * [.getClient()](#module_db.getClient) ⇒ <code>Promise</code>

<a name="module_db.query"></a>

### db.query(sql) ⇒ <code>Promise</code>
Execute a query on the database pool.

**Kind**: static method of [<code>db</code>](#module_db)  
**Returns**: <code>Promise</code> - The query result  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| sql | <code>Object</code> | The object containing the query string and values. |
| sql.text | <code>string</code> | The query string. |
| sql.values | <code>array</code> | The query parameter(s) |

<a name="module_db.getClient"></a>

### db.getClient() ⇒ <code>Promise</code>
Get the client from the connection pool.

**Kind**: static method of [<code>db</code>](#module_db)  
**Returns**: <code>Promise</code> - The client  
**Throws**:

- <code>Error</code> 

