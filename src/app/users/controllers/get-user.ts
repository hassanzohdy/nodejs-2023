export default function getUser(request: any) {
  return {
    id: request.params.id,
  };
}
