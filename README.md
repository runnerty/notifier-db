<p align="center">
  <a href="http://runnerty.io">
    <img height="257" src="https://runnerty.io/assets/header/logo-stroked.png">
  </a>
  <p align="center">Smart Processes Management</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]
<a href="#badge">
  <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
</a>


A notified for the insertion of records in database [Runnerty]

### Installation:
Through NPM

```bash
npm i @runnerty/notifier-db
```

You can also add modules to your project with [runnerty]

```bash
npx runnerty add @runnerty/notifier-db
```

This command installs the module in your project, adds example configuration in your [config.json] and creates an example plan of use.

If you have installed [runnerty] globally you can include the module with this command:

```bash
runnerty add @runnerty/notifier-db
```

### Configuration sample:
Add in [config.json]:

```json
{
  "notifiers": [
    {
      "id": "notifier_db_default",
      "type": "@runnerty-notifier-db",
      "user": "postgres",
      "table": "rty.notifications",
      "password": "my_password",
      "database": "postgres",
      "host": "my_host",
      "port": "5432"
    }
  ]
}
```

# Usage

You only have to indicate the "id" of the notified and the message you want to be inserted in the "message" column of the table indicated in the configuration.

```json
{
  "notifications": {
    "on_end": [
      {
        "id": "notifier_db_default",
        "message": "Things done right."
      }
    ]
  }
}
```

In case you want to insert extra columns in addition to the "message" column you can indicate them in the "columns" property.

```json
{
  "notifiers": [
    {
      "id": "notifier_db_default",
      "type": "@runnerty-notifier-db",
      "user": "postgres",
      "table": "rty.notifications",
      "password": "my_password",
      "database": "postgres",
      "host": "my_host",
      "port": "5432",
      "columns": ["message", "mode", "key"]
    }
  ]
}
```

```json
{
  "notifications": {
    "on_end": [
      {
        "id": "notifier_db_default",
        "key": "@GV(CHAIN_ID)",
        "message": "Things done right.",
        "mode": "info"
      }
    ]
  }
}
```

[Runnerty]: https://www.runnerty.io
[downloads-image]: https://img.shields.io/npm/dm/@runnerty/notifier-db.svg
[npm-url]: https://www.npmjs.com/package/@runnerty/notifier-db
[npm-image]: https://img.shields.io/npm/v/@runnerty/notifier-db.svg
[david-badge]: https://david-dm.org/runnerty/notifier-db.svg
[david-badge-url]: https://david-dm.org/runnerty/notifier-db
[config.json]: http://docs.runnerty.io/config/
[plan.json]: http://docs.runnerty.io/plan/