const useRequest = () => {
  const get = async (url) => {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.json();
  };

  const post = async (url, payload, headers, raw = false) => {
    const res = await fetch(url, {
      headers,
      method: "POST",
      body:
        typeof payload === "string" || raw ? payload : JSON.stringify(payload),
    });
    return res.json();
  };

  const corsRequest = (method, url, body, headers, raw = false) => {
    const payload = btoa(
      JSON.stringify({
        url,
        body,
        headers,
        method,
      })
    );
    return post("/api/request", payload, undefined, raw);
  };

  return { get, post, corsRequest };
};

export default useRequest;
