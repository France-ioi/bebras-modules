if (!window.instructionsPostProcessing) {
  window.instructionsPostProcessing = [];
}

window.instructionsPostProcessing.push(function () {
   const inlineMaths = document.querySelectorAll('span.math.math-inline');
   inlineMaths.forEach(span => {
     try {
       katex.render(span.innerText, span);
     } catch (err) {
       console.error('Error rendering KaTeX:', err);
     }
   });
 });
