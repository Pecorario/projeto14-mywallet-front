export default function formatErrors(error) {
  if (Array.isArray(error.response.data)) {
    return error.response.data;
  } else {
    return [error.response.data];
  }
}
