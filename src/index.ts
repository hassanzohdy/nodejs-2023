import "app/routes";
import startApplication from "core/application";
import connection from "core/database/connection";

startApplication();

connection.connect();
