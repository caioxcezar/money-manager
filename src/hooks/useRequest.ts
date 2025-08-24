const useRequest = () => {
  const get = async (url: string) => {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.json();
  };

  const post = async (url: string, payload?: string | Blob | null, headers?: HeadersInit, raw?: boolean) => {
    const res = await fetch(url, {
      headers,
      method: "POST",
      body:
        typeof payload === "string" || raw ? payload : JSON.stringify(payload),
    });
    return res.json();
  };

  const corsRequest = (method: "POST" | "GET", url: string, body: string | object, headers?: HeadersInit, raw?: boolean) => {
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
