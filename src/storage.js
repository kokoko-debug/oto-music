// Keep the existing key and schema so desktop learners retain their progress.
(() => {
  const key = 'oto-learning-preview';
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
  window.openai = {
    widgetState: saved,
    setWidgetState(value) {
      this.widgetState = value;
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
      return Promise.resolve();
    }
  };
})();
