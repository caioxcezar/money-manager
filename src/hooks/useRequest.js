const useRequest = () => {
  const get = async (url) => {
    const res = await fetch(url, {
      method: "GET",
    });
    return res.json();
  };

  const post = async (url, payload, headers) => {
    const res = await fetch(url, {
      headers,
      method: "POST",
      body: typeof payload === "string" ? payload : JSON.stringify(payload),
    });
    return res.json();
  };

  const corsRequest = (method, url, body, headers) => {
    const payload = btoa(
      JSON.stringify({
        url,
        body,
        headers,
        method,
      })
    );
    return post(`/api/request`, payload);
  };

  return { get, post, corsRequest };
};

export default useRequest;
