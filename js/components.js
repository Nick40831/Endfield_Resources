export async function insertComponent(selector, file) {
  const container = document.querySelector(selector);

  const html = await fetch(file).then(res => res.text());
  container.innerHTML = html;
}