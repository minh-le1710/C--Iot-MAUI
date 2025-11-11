window.store = {
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  get: (k,def) => { try{ const v = localStorage.getItem(k); return v? JSON.parse(v): def; } catch { return def; }},
  remove: (k) => localStorage.removeItem(k)
};
