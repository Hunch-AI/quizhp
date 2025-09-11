import type { Question } from "./types";

/** Normalize API question to the template's QUESTION shape. */
export function serializeQuestion(q: Question) {
  return {
    type: q.question_type,
    prompt: q.question,
    choices: q.choices.map((c) => ({
      text: c.text,
      is_correct: !!c.is_correct,
      explanation: c.explanation ?? "",
    })),
  };
}

const QUESTION_BLOCK = /const\s+QUESTION\s*=\s*{[\s\S]*?};/;

/**
 * Replaces `const QUESTION = {...};` in the HTML, or inserts a fallback token if present.
 * Also appends a shim that posts quiz events to the parent window.
 */
export function injectQuestionIntoCode(html: string, q: Question): string {
  const json = JSON.stringify(serializeQuestion(q), null, 2);
  const replacement = `const QUESTION = ${json};`;

  if (QUESTION_BLOCK.test(html)) {
    html = html.replace(QUESTION_BLOCK, replacement);
  } else if (html.includes("/*__QUESTION_JSON__*/")) {
    html = html.replace("/*__QUESTION_JSON__*/", json);
  } else {
    // If no recognizable token, prepend a <script> with QUESTION (keeps it simple).
    html = html.replace(
      /<body[^>]*>/i,
      (m) => `${m}\n<script>${replacement}</script>`
    );
  }

  return appendShim(html);
}

/** Adds a script that wraps engine.end and exposes window.__report for choice events. */
function appendShim(html: string): string {
  const shim = `
<script>
(function(){
  function post(type, detail){ try{ parent.postMessage(Object.assign({type}, detail), '*'); }catch(e){} }

  // Optional direct reporting API for templates at selection-time:
  // window.__report(i, isCorrect, explanation)
  Object.defineProperty(window, '__report', {
    value: function(choiceIndex, isCorrect, explanation){
      post('quiz-choice', { choiceIndex, isCorrect: !!isCorrect, explanation: explanation || '' });
    },
    writable: false
  });

  // Wrap engine.end once engine becomes available
  var iv = setInterval(function(){
    try {
      if (window.engine && window.engine.end && !window.engine.__wrapped){
        var _end = window.engine.end.bind(window.engine);
        window.engine.end = function(ok, explanation){
          try { post('quiz-end', { isCorrect: !!ok, explanation: explanation || '' }); } catch(e){}
          return _end(ok, explanation);
        };
        window.engine.__wrapped = true;
        try { post('quiz-ready', {}); } catch(e){}
        clearInterval(iv);
      }
    } catch(e) { /* ignore */ }
  }, 50);
})();
</script>`.trim();

  // Prefer inserting before </body></html>; otherwise append at end.
  if (/(<\/body>\s*<\/html>\s*)$/i.test(html)) {
    return html.replace(/<\/body>\s*<\/html>\s*$/i, `${shim}\n</body></html>`);
  }
  return html + "\n" + shim;
}
