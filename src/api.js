async function request(path, options = null) {
  const url = `${import.meta.env.VITE_API_ENDPOINT}${path}`;
  const response = await fetch(url, options);
  return response.json();
}

export function getPublishers(userId) {
  return request(`/publishers?UserId=${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getKids(userId) {
  return request(`/studynow?UserId=${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getkids_study(kids_study) {
  return request(
    `/kids_study?UserId=${encodeURIComponent(
      kids_study["UserId"]
    )}&kid_id=${encodeURIComponent(kids_study["子Id"])}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function get_itemfalse(item, limit = 10, offset = 0) {
  return request(
    `/itemsfalse?filter=${item["UserId"]}&shounin=${item["shounin"]}&kid=${item["kid"]}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function get_item(item1, item2, page) {
  return request(`/items?filter1=${item1}&filter2=${item2}&page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export function poststudy(study) {
  return request("/study", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(study),
  });
}

export function postKids(kids) {
  return request("/kids", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(kids),
  });
}
export function postParents(parents) {
  return request("/parents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parents),
  });
}
export function update_study(kids_study) {
  return request("/study_update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(kids_study),
  });
}
export function post_pay(pay) {
  return request("/study_pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pay),
  });
}
export function change_pay(pay) {
  return request("/change_pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pay),
  });
}
export function delete_kids(kid) {
  return request("/delete_kids", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(kid),
  });
}

export function study_realtime(time) {
  return request("/now_kids", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(time),
  });
}
