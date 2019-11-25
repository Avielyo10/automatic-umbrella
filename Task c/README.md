# Task C

In case you get the following error: `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`, Execute the following query in MYSQL:  

`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`  
Where `root` as your user `localhost` as your URL and `password` as your password.
