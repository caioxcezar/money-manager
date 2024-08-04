export default async function handler(req, res) {
  try {
    const body = req.body;
    const str = atob(body);
    const init = JSON.parse(str);
    const headers = init.headers ?? {};
    const response = await fetch(init.url, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers["user-agent"],
        ...headers,
      },
      method: init.method,
      body: init.method === "GET" ? undefined : JSON.stringify(init.body),
    });
    const json = await response.json();
    res.status(200).send(json);
  } catch (error) {
    res.status(400).send(error);
  }
}
