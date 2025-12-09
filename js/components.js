export async function insertComponent(selector, file, callback = null) {
  const container = document.querySelector(selector);

  const html = await fetch(file).then(res => res.text());
  container.innerHTML = html;

  if (callback) {
      callback();
  }
}