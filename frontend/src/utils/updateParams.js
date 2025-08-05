export function updateParams(updates, searchParams, setSearchParams) {
  const params = new URLSearchParams(searchParams);
  Object.entries(updates).forEach(([key, val]) => {
    if (val != null && val !== "") params.set(key, val);
    else params.delete(key);
  });
  params.set("pIndex", "1");
  setSearchParams(params);
}
