export default function createUser(request: any) {
  console.log("Body", request.body);

  return request.body;
}
