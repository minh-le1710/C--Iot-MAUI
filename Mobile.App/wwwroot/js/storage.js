window.store = {
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  get: (k,def) => { try{ const v = localStorage.getItem(k); return v? JSON.parse(v): def; } catch { return def; }},
  remove: (k) => localStorage.removeItem(k)
};

// wwwroot/js/storage.js
window.store = window.store || {
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  get: (k,def) => { try{ const v = localStorage.getItem(k); return v? JSON.parse(v): def; } catch { return def; }},
  remove: (k) => localStorage.removeItem(k)
};

// Đọc file từ input[type=file] đầu tiên trên trang → dataURL
window.store.readFileAsDataUrl = () => new Promise((resolve, reject) => {
  const inp = document.querySelector("input[type=file]");
  if (!inp || !inp.files || inp.files.length === 0) { resolve(""); return; }
  const file = inp.files[0];
  const fr = new FileReader();
  fr.onload = () => resolve(fr.result);
  fr.onerror = () => reject(fr.error);
  fr.readAsDataURL(file);
});
