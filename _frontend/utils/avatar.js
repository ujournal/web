export default function avatar(user) {
  const params = new URLSearchParams({
    s: 250,
    d: "robohash",
  });

  return `https://gravatar.com/avatar/${user.hash}?${params}`;
}
