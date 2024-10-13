if (!window.instructionsPostProcessing) {
  window.instructionsPostProcessing = [];
}

window.instructionsPostProcessing.push(function () {
  const inlineMaths = document.querySelectorAll('span.math.math-inline');
  inlineMaths.forEach(span => {
    if (span.querySelectorAll('span.katex').length > 0) {
      // Avoid rendering twice (KaTeX will not detect)
      return;
    }
    try {
      katex.render(span.innerText, span);
    } catch (err) {
      console.error('Error rendering KaTeX:', err);
    }
  });
});
