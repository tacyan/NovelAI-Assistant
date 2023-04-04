document.addEventListener('DOMContentLoaded', () => {
  const memoForm = document.getElementById('memo-form');
  const titleInput = document.getElementById('title');
  const promptInput = document.getElementById('prompt');
  const negativePromptInput = document.getElementById('negativePrompt');
  const saveButton = document.getElementById('save');
  const memoList = document.getElementById('memo-list');

  function updateMemoList() {
    memoList.innerHTML = '';

    chrome.storage.local.get('memos', ({ memos }) => {
      if (!memos) return;

      memos.forEach((memo, index) => {
        const listItem = document.createElement('li');

        const memoTitle = document.createElement('span');
        memoTitle.textContent = memo.title;
        listItem.appendChild(memoTitle);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
          memos.splice(index, 1);
          chrome.storage.local.set({ memos }, () => {
            updateMemoList();
          });
        });

        listItem.appendChild(deleteButton);

        listItem.addEventListener('click', (e) => {
          if (e.target !== deleteButton) {
            titleInput.value = memo.title;
            promptInput.value = memo.prompt;
            negativePromptInput.value = memo.negativePrompt || '';
            storeTemporaryValues();
          }
        });

        memoList.appendChild(listItem);
      });
    });
  }

  function storeTemporaryValues() {
    const tempValues = {
      tempTitle: titleInput.value,
      tempPrompt: promptInput.value,
      tempNegativePrompt: negativePromptInput.value,
    };
    chrome.storage.local.set(tempValues);
  }

  function loadTemporaryValues() {
    chrome.storage.local.get(['tempTitle', 'tempPrompt', 'tempNegativePrompt'], ({ tempTitle, tempPrompt, tempNegativePrompt }) => {
      titleInput.value = tempTitle || '';
      promptInput.value = tempPrompt || '';
      negativePromptInput.value = tempNegativePrompt || '';
    });
  }

  titleInput.addEventListener('input', storeTemporaryValues);
  promptInput.addEventListener('input', storeTemporaryValues);
  negativePromptInput.addEventListener('input', storeTemporaryValues);

  saveButton.addEventListener('click', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const prompt = promptInput.value.trim();
    const negativePrompt = negativePromptInput.value.trim();

    if (!title || !prompt) return;

    chrome.storage.local.get('memos', ({ memos }) => {
      const newMemo = { title, prompt, negativePrompt };
      const updatedMemos = memos ? [...memos, newMemo] : [newMemo];

      chrome.storage.local.set({ memos: updatedMemos }, () => {
        updateMemoList();
        memoForm.reset();
        chrome.storage.local.remove(['tempTitle', 'tempPrompt', 'tempNegativePrompt']);
      });
    });
  });

  updateMemoList();
  loadTemporaryValues();
});
