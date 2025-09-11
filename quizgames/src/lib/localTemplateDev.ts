/** A minimal HTML template that posts quiz-choice events when a button is clicked. */
export const DEV_TEMPLATE_TRUE_FALSE = String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>Dev Template</title>
<style>
  body{background:#0f1220;color:#e6eaf2;font:16px/1.4 ui-sans-serif,system-ui;-webkit-font-smoothing:antialiased;margin:0;padding:24px;}
  .card{background:#161a2e;border:1px solid #23294d;border-radius:10px;padding:16px;max-width:720px;}
  button{font-size:16px;margin:8px 8px 0 0;padding:8px 12px;border-radius:8px;border:1px solid #23294d;background:transparent;color:#e6eaf2;cursor:pointer;}
  button:hover{opacity:.9}
  </style>
  </head>
  <body>
    <div class="card">
      <h2>Dev Template</h2>
      <p id="prompt"></p>
      <div id="choices"></div>
    </div>
  <script>
  // Will be replaced by injector if present:
  const QUESTION = {
    type: "true_false",
    prompt: "The dev template is working.",
    choices: [
      { text: "True", is_correct: true, explanation: "Yup, you clicked a dev button." },
      { text: "False", is_correct: false, explanation: "This is just a stub." }
    ]
  };
  
  (function render(q){
    document.getElementById('prompt').textContent = q.prompt;
    const c = document.getElementById('choices');
    c.innerHTML = '';
    q.choices.forEach((choice, i) => {
      const b = document.createElement('button');
      b.textContent = choice.text;
      b.onclick = () => {
        parent.postMessage({ type:'quiz-choice', choiceIndex:i, isCorrect: !!choice.is_correct, explanation: choice.explanation || '' }, '*');
      };
      c.appendChild(b);
    });
  })(QUESTION);
  </script>
  </body></html>`;
