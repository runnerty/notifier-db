'use strict';

const Notifier = require('@runnerty/module-core').Notifier;
const pg = require('pg');
const fs = require('fs');

class dbNotifier extends Notifier {
  constructor(notification) {
    super(notification);
    this.endOptions = {};
  }

  async send(notification) {
    notification.mode = notification.mode ? notification.mode.toString() : 'info';
    notification.message = notification.message ? notification.message.toString() : '';

    if (!notification.columns || notification.columns.lenght === 0) notification.columns = ['message'];
    const columnsConcat = notification.columns.join(', ');

    const values = [];
    for (const column of notification?.columns) {
      values.push(notification[column] || 'NULL');
    }
    let valuesConcat = "'" + values.join("','") + "'";
    valuesConcat = valuesConcat.replace(/'NULL'/g, 'NULL');
    notification.command = `INSERT INTO ${notification.table} (${columnsConcat}) VALUES (${valuesConcat});`;

    try {
      const connectionOptions = {
        user: notification.user,
        host: notification.host,
        database: notification.database,
        password: notification.password,
        port: notification.port,
        application_name: notification.application_name || 'runnerty',
        connectionTimeoutMillis: notification.connectionTimeoutMillis || 60000,
        query_timeout: notification.query_timeout || false,
        statement_timeout: notification.statement_timeout || false,
        idle_in_transaction_session_timeout: notification.idle_in_transaction_session_timeout || false,
        keepAlive: notification.keepAlive || false,
        keepAliveInitialDelayMillis: notification.keepAliveInitialDelayMillis || 0,
        encoding: notification.encoding || 'utf8'
      };

      //SSL
      if (notification.ssl) {
        try {
          if (notification.ssl.ca) notification.ssl.ca = fs.readFileSync(notification.ssl.ca);
          if (notification.ssl.cert) notification.ssl.cert = fs.readFileSync(notification.ssl.cert);
          if (notification.ssl.key) notification.ssl.key = fs.readFileSync(notification.ssl.key);
          connectionOptions.ssl = notification.ssl;
        } catch (error) {
          this.endOptions.end = 'error';
          this.endOptions.messageLog = `notifier-db: ${error}`;
          this.end(this.endOptions);
        }
      }

      const pool = new pg.Pool(connectionOptions);

      pool.on('error', error => {
        this.endOptions.end = 'error';
        this.endOptions.messageLog = `notifier-db: ${error}`;
        this.end(this.endOptions);
      });

      const client = await pool.connect();
      await client.query(notification.command);
      client.release();
    } catch (error) {
      this.endOptions.end = 'error';
      this.endOptions.messageLog = `notifier-db: ${error}`;
      this.end(this.endOptions);
    }

    this.end();
  }
}

module.exports = dbNotifier;
