const createQuiz = {
  addQuestion: (element, offset = 0) => {
    const index = Array.from(element.parentNode.children).indexOf(element) + offset;

    const questionMarkup = `
    <div class="add-mid-question" onclick="createQuiz.addQuestion(this, -1)">
      <p><i class="fas fa-plus"></i> Add question</p>
    </div>
    <div class="question-container card four-children">
      <div class="input-container bottom">
        <div>
          <label for="question">Question</label>
          <input type="text" name="question[]" class="text-input question" placeholder="Enter a question" required>
        </div>
        <i class="fas fa-trash-alt" onclick="createQuiz.deleteQuestion(this)"></i>
      </div>
      <div class="options-container">
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="0">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="1">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="2">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="add-option-btn">
          <button type="button" name="addOption" onclick="createQuiz.addOption(this, ${index})"><i class="fas fa-plus"></i> Add option</button>
        </div>
      </div>
    </div>
    `;
    element.insertAdjacentHTML('beforebegin', questionMarkup)

    const questionsContainer = element.closest('.questions-container');
    createQuiz.indexQuestions(questionsContainer)
  },
  addOption: (element, questionIndex) => {
    const questionContainer = element.closest('.question-container');
    const optionsContainer = element.closest('.options-container');
    const optionsContainerChildren = optionsContainer.childElementCount + 1;
    optionsContainerChildren == 5 ? questionContainer.classList.remove('four-children') : null;
    
    const index = Array.from(element.closest('.options-container').children).indexOf(element.parentNode);
    const optionMarkup = `
    <div class="option-container">
      <div class="input-container bottom">
        <div>
          <label for="option">Option</label>
          <input type="text" name="option[${questionIndex}][]" class="text-input option" placeholder="Option" required>
        </div>
        <input type="checkbox" name="answer[${questionIndex}][]" class="checkbox-input" value="${index}">
        <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
      </div>
    </div>
  `;
  return element ? element.parentNode.insertAdjacentHTML('beforebegin', optionMarkup) : optionMarkup
  },
  deleteQuestion: deleteButton => {
    const questionsContainer = deleteButton.closest('.questions-container');
    const questionContainer = deleteButton.closest('.question-container');
    createQuiz.getPreviousSiblingWithClass(questionContainer, '.add-mid-question').remove();
    questionContainer.remove();
    createQuiz.indexQuestions(questionsContainer)
  },
  deleteOption: deleteButton => {
    const questionContainer = deleteButton.closest('.question-container');
    const optionsContainer = deleteButton.closest('.options-container');
    const optionsContainerChildrenCount = optionsContainer.childElementCount - 1;
    optionsContainerChildrenCount == 4 ? questionContainer.classList.add('four-children') : null;
    
    deleteButton.closest('.option-container').remove();
    
    const optionsContainerChildren = [ ...optionsContainer.childNodes ]
    let index = 0;

    for(const element of optionsContainerChildren) {
      if(element.className === 'option-container') {
        element.getElementsByClassName('checkbox-input')[0].value = index
        index++
      }
    }
  },
  indexQuestions: questionsContainer => {
    const questionsContainerChildren = [ ...questionsContainer.childNodes ]
    let index = 0;
    for(const element of questionsContainerChildren) {
      if(element.classList && element.classList.contains('question-container')) {
        for(const inputField of element.querySelectorAll('.text-input.option, .checkbox-input, [name=addOption]')) {
          if(inputField.type === 'text') {
            inputField.name = `option[${index}][]`
          }
          if(inputField.type === 'checkbox') {
            inputField.name = `answer[${index}][]`
          }
          if(inputField.type === 'button') {
            inputField.setAttribute('onclick', `createQuiz.addOption(this, ${index})`)
          }
        }
        index++
      }
    }
  },
  getPreviousSiblingWithClass(element, selector) {
    const sibling = element.previousElementSibling;
    if (!selector) return sibling;
    while (sibling) {
      if (sibling.matches(selector)) return sibling;
      sibling = sibling.previousElementSibling;
    }
  }
}