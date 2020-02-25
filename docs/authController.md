<a name="module_authController"></a>

## authController

* [authController](#module_authController)
    * [.login(ctx, _next)](#module_authController.login) ⇒ <code>Promise</code>
    * [.register(ctx, _next)](#module_authController.register) ⇒ <code>Promise</code>
    * [.verify(ctx, _next)](#module_authController.verify) ⇒ <code>Promise</code>
    * [.recoverPassword(ctx, _next)](#module_authController.recoverPassword) ⇒ <code>Promise</code>
    * [.resetPassword(ctx, _next)](#module_authController.resetPassword) ⇒ <code>Promise</code>

<a name="module_authController.login"></a>

### authController.login(ctx, _next) ⇒ <code>Promise</code>
Handle a login request

**Kind**: static method of [<code>authController</code>](#module_authController)  
**Returns**: <code>Promise</code> - The http response object  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | The application context |
| _next | <code>function</code> | The downstream request handler |

<a name="module_authController.register"></a>

### authController.register(ctx, _next) ⇒ <code>Promise</code>
Handle a registration request

**Kind**: static method of [<code>authController</code>](#module_authController)  
**Returns**: <code>Promise</code> - The http response object  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | The application context |
| _next | <code>function</code> | The downstream request handler |

<a name="module_authController.verify"></a>

### authController.verify(ctx, _next) ⇒ <code>Promise</code>
Handle a new user account verification request

**Kind**: static method of [<code>authController</code>](#module_authController)  
**Returns**: <code>Promise</code> - The http response object  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | The application context |
| _next | <code>function</code> | The downstream request handler |

<a name="module_authController.recoverPassword"></a>

### authController.recoverPassword(ctx, _next) ⇒ <code>Promise</code>
Handle a password recovery request

**Kind**: static method of [<code>authController</code>](#module_authController)  
**Returns**: <code>Promise</code> - The http response object  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | The application context |
| _next | <code>function</code> | The downstream request handler |

<a name="module_authController.resetPassword"></a>

### authController.resetPassword(ctx, _next) ⇒ <code>Promise</code>
Handle a password reset request

**Kind**: static method of [<code>authController</code>](#module_authController)  
**Returns**: <code>Promise</code> - The http response object  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | The application context |
| _next | <code>function</code> | The downstream request handler |

