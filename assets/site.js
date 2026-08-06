document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy-target]');
  if (!button) return;
  const target = document.getElementById(button.dataset.copyTarget);
  if (!target) return;
  const text = target.innerText.trim();
  const original = button.textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      if (!document.execCommand('copy')) throw new Error('copy failed');
      textarea.remove();
    }
    button.textContent = '已复制';
    button.classList.add('copied');
  } catch (error) {
    button.textContent = '复制失败，请手动选择';
  }
  window.setTimeout(() => {
    button.textContent = original;
    button.classList.remove('copied');
  }, 6000);
});
