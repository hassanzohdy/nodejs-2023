import { connection } from "core/database";
import router from "core/router";
import login from "./controllers/auth/login";
import restfulUser from "./controllers/restful-user";
import Product from "./models/product";

router.resource("/users", restfulUser);

router.post("/login", login);

connection.on("connected", async () => {
  // for (let i = 0; i < 100; i++) {
  //   const user = new User();
  //   user.set("name", `user ${i}`);
  //   const date = new Date();
  //   date.setFullYear(
  //     Random.int(2000, 2023),
  //     Random.int(0, 1),
  //     Random.int(1, 28),
  //   );
  //   user.set("date", date);
  //   console.log(`Saving user ${i}`);
  //   await user.save();
  //   console.log(`User ${i} saved`);
  // }

  const product = await Product.create({
    name: "parent",
  });

  console.log("Parent", product.get("id"));

  // console.log("Parent", product.data);

  const childProduct = await Product.create({
    name: "child",
    parent: product.only(["id", "name"]),
  });

  console.log("Child", childProduct.get("id"));

  setTimeout(async () => {
    console.log((await Product.find(product.get("id")))?.data);
  }, 2500);

  // console.log((await Product.find(childProduct.get("id")))?.data);

  // console.log(product.data);

  // const user = User.aggregate();
  // user.orWhere({
  //   age: isNull(),
  // });
  // const users = await user.get();
  // console.log(users.length);
  // console.log(await (await user.get()).map(user => user.only(["id", "date"])));
  //   const userGroup = await UserGroup.first();
  //   if (!userGroup) return;
  //   const users = await User.list();
  //   for (const user of users) {
  //     user.set("group", userGroup.only(["id", "name"]));
  //     console.log(user.data);
  //     await user.save();
  //   }
});
